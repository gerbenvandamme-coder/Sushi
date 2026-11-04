/* Scroll-scrubbed intro video.
   Standalone layer: it only reads #scrub and toggles html.is-menu-visible. */
(function () {
  'use strict';

  var SHOW_AT = 0.8;      /* progress at which the page fades in */
  var HIDE_BELOW = 0.72;    /* progress below which it hides again (stops flicker near the threshold) */
  var LERP_RATE = 40;       /* higher = the video follows the scroll more tightly, per second */
  var SETTLE = 0.0005;     /* progress difference treated as "arrived" */
  var SEEK_EPSILON = 0.006; /* seconds; smaller differences are not worth a seek */
  var FADE_START = 0.55;    /* progress where the video starts to dim and soften; fully dim at 1 */
  var MAX_FRAME_S = 0.05;  /* cap dt so a stalled tab does not jump */

  var root = document.documentElement;
  if (!root.classList.contains('scrub-on')) return;

  var runway = document.getElementById('scrub');
  var video = runway ? runway.querySelector('.scrub__video') : null;
  /* Clip list: data-src is tried first, data-fallback-src only if that file fails to load. */
  var STALL_MS = 8000;      /* phones only: no metadata after this long counts as a failed clip */

  /* True for phones, false for tablets (iPad, Android tablets) and desktops. iPadOS reports itself as
     a Mac, and Android tablets leave "Mobile" out of the user agent, so neither matches. */
  function isPhone() {
    var uaData = navigator.userAgentData;
    if (uaData && typeof uaData.mobile === 'boolean') return uaData.mobile;
    return /iPhone|iPod|Android.+Mobile|Windows Phone/i.test(navigator.userAgent || '');
  }
  var phone = isPhone();

  /* Phones get the level 4.2 / 60 fps clip first (the 1080p/75 fps one needs level 5.1, which many phone
     decoders lack), then the 720p clip. Everything else keeps data-src first, then the 720p clip. */
  var sources = video
    ? [phone ? video.getAttribute('data-phone-src') : video.getAttribute('data-src'), video.getAttribute('data-fallback-src')].filter(Boolean)
    : [];
  var sourceIndex = 0;
  var stallTimer = 0;
  var IDLE_MS = 15000;      /* no bytes received for this long counts as a failed download */
  var READY_GRACE_MS = 1500; /* after the metadata: wait this long for the first frame, then show the page anyway */
  var FONT_WAIT_MS = 1500;  /* the page waits at most this long for the web font before it opens */
  if (!runway || !video || !sources.length) {
    root.classList.remove('scrub-on', 'scrub-loading');
    return;
  }

  var duration = 0;
  var target = 0;
  var current = 0;
  var lastFrame = 0;
  var rafId = 0;
  var menuVisible = false;

  function clamp01(value) {
    return value < 0 ? 0 : value > 1 ? 1 : value;
  }

  /* 0 at the top of the runway, 1 when its bottom edge reaches the bottom of the viewport. */
  function readProgress() {
    var top = runway.getBoundingClientRect().top + window.scrollY;
    var span = runway.offsetHeight - window.innerHeight;
    return span > 0 ? clamp01((window.scrollY - top) / span) : 1;
  }

  /* 0 until FADE_START, then eases (smoothstep) to 1 at the end of the runway. */
  function fadeAmount(progress) {
    var t = clamp01((progress - FADE_START) / (1 - FADE_START));
    return t * t * (3 - 2 * t);
  }

  function setMenuVisible(next) {
    if (next === menuVisible) return;
    menuVisible = next;
    root.classList.toggle('is-menu-visible', next);
  }

  function showProgress(progress) {
    runway.style.setProperty('--scrub-p', progress.toFixed(3));
    runway.style.setProperty('--scrub-fade', fadeAmount(progress).toFixed(3));
    if (progress >= SHOW_AT) setMenuVisible(true);
    else if (progress < HIDE_BELOW) setMenuVisible(false);
  }

  /* Returns true when the video is where it should be. */
  function render() {
    if (!duration) return true;
    var wanted = current * duration;
    if (Math.abs(wanted - video.currentTime) < SEEK_EPSILON) return true;
    if (video.seeking) return false;
    video.currentTime = wanted;
    return true;
  }

  function tick(now) {
    var dt = Math.min((now - lastFrame) / 1000, MAX_FRAME_S);
    lastFrame = now;
    current += (target - current) * (1 - Math.exp(-LERP_RATE * dt));
    if (Math.abs(target - current) < SETTLE) current = target;
    var synced = render();
    if (current !== target || !synced) {
      rafId = window.requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  }

  function wake() {
    if (rafId) return;
    lastFrame = performance.now();
    rafId = window.requestAnimationFrame(tick);
  }

  function onScroll() {
    var next = readProgress();
    if (next === target) return;
    target = next;
    showProgress(next);
    wake();
  }

  function onMetadata() {
    if (!isFinite(video.duration) || video.duration <= 0) return;
    window.clearTimeout(stallTimer);
    duration = video.duration;
    target = current = readProgress();
    wake();
    if (blobUrl) {
      /* The whole clip is in memory and the decoder accepted it: show the page once the first frame is there. */
      window.clearTimeout(readyTimer);
      readyTimer = window.setTimeout(function () { endLoading(true); }, READY_GRACE_MS);
    } else {
      checkBuffered();
    }
  }

  /* Missing or broken video: hand the page back untouched. */
  function disable() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    window.clearTimeout(stallTimer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    window.removeEventListener('pageshow', onScroll);
    abortLoad();
    video.removeAttribute('src');
    video.load();
    releaseBlob();
    endLoading(false);
    root.classList.remove('scrub-on', 'is-menu-visible');
  }

  /* Some phone decoders accept a clip but never fire "error" or "loadedmetadata". On phones, move on to
     the next clip when no metadata has arrived in time. The last clip in the list is never timed out. */
  function armStallTimer() {
    window.clearTimeout(stallTimer);
    if (!phone || sourceIndex >= sources.length - 1) return;
    stallTimer = window.setTimeout(function () {
      if (!duration) onError();
    }, STALL_MS);
  }

  /* ----- Loading gate: the page stays blank until the whole clip is loaded -----
     The clip is downloaded with fetch() into a Blob and played from memory, so nothing has to be streamed
     while scrubbing and it also works on servers without byte-range support. If fetch is unavailable or
     blocked (for example file://), the video element loads the clip itself and the page opens once it is
     buffered to the end. */
  var loading = root.classList.contains('scrub-loading');
  var loadToken = 0;
  var loadAbortController = null;
  var idleTimer = 0;
  var readyTimer = 0;
  var blobUrl = '';

  /* ready = true: the clip works, tell the other scripts. false: the intro was switched off. */
  function endLoading(ready) {
    window.clearTimeout(readyTimer);
    window.clearTimeout(idleTimer);
    if (!loading) return;
    loading = false;

    function openPage() {
      root.classList.remove('scrub-loading');
      if (ready) window.dispatchEvent(new Event('sd:video-ready'));
    }

    /* Open together with the heading font so the text does not change shape right after the page appears.
       The wait is capped, so a slow font server cannot keep the page blank. */
    if (ready && document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise(function (resolve) { window.setTimeout(resolve, FONT_WAIT_MS); })
      ]).then(openPage, openPage);
    } else {
      openPage();
    }
  }

  function abortLoad() {
    loadToken += 1; /* callbacks of the abandoned download see a stale token and stop */
    if (loadAbortController) {
      try { loadAbortController.abort(); } catch (err) { /* already finished */ }
      loadAbortController = null;
    }
  }

  function releaseBlob() {
    if (!blobUrl) return;
    window.URL.revokeObjectURL(blobUrl);
    blobUrl = '';
  }

  /* A download that receives no data for IDLE_MS is treated like a failed clip. */
  function armIdle() {
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(function () {
      abortLoad();
      onError();
    }, IDLE_MS);
  }

  function fetchClip(url, token) {
    if (!window.fetch || !window.Blob || !window.URL || !window.URL.createObjectURL) {
      return Promise.reject(new Error('fetch unavailable'));
    }
    loadAbortController = window.AbortController ? new window.AbortController() : null;
    var options = loadAbortController ? { signal: loadAbortController.signal } : {};
    armIdle();
    return window.fetch(url, options).then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      if (!response.body || !response.body.getReader) return response.blob();
      var reader = response.body.getReader();
      var chunks = [];
      function pump() {
        return reader.read().then(function (result) {
          if (token !== loadToken) throw new Error('stale');
          if (result.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(result.value);
          armIdle();
          return pump();
        });
      }
      return pump();
    });
  }

  /* Starts loading sources[index]. */
  function startSource(index) {
    abortLoad();
    sourceIndex = index;
    var token = loadToken;
    var url = sources[index];
    window.clearTimeout(stallTimer);
    window.clearTimeout(readyTimer);
    releaseBlob();
    fetchClip(url, token).then(function (blob) {
      if (token !== loadToken) return;
      window.clearTimeout(idleTimer);
      var clip = blob.type === 'video/mp4' ? blob : new Blob([blob], { type: 'video/mp4' });
      blobUrl = window.URL.createObjectURL(clip);
      video.src = blobUrl;
      armStallTimer();
    }, function () {
      if (token !== loadToken) return;
      window.clearTimeout(idleTimer);
      /* fetch is blocked or the file is missing: let the video element try it. A missing or broken
         file fires "error", which moves on to the next clip. */
      video.src = url;
      armStallTimer();
    });
  }

  /* Only used when the video element loads the clip itself: ready once it is buffered to the end. */
  function checkBuffered() {
    if (!loading || blobUrl || !duration) return;
    var ranges = video.buffered;
    var end = ranges.length ? ranges.end(ranges.length - 1) : 0;
    if (end >= duration - 0.3) endLoading(true);
  }

  /* A clip failed to load: try the next one in the list, and only give up when none are left. */
  function onError() {
    if (sourceIndex < sources.length - 1) {
      startSource(sourceIndex + 1);
      return;
    }
    disable();
  }

  /* iOS Safari only scrubs a video after it has been started once by a user gesture. */
  function unlockPlayback() {
    /* While the page is still blank there is no clip to start yet; try again on the next touch. */
    if (loading || !duration) return;
    window.removeEventListener('touchstart', unlockPlayback);
    var attempt = video.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt.then(function () {
        video.pause();
        wake();
      }, function () { /* Not allowed: scrubbing still works on other browsers. */ });
    }
  }

  video.muted = true;
  video.addEventListener('loadedmetadata', onMetadata);
  video.addEventListener('error', onError);
  video.addEventListener('progress', checkBuffered);
  video.addEventListener('canplaythrough', function () {
    if (loading && !blobUrl && duration) endLoading(true);
  });
  video.addEventListener('loadeddata', function () {
    if (loading && blobUrl) endLoading(true);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('pageshow', onScroll);
  window.addEventListener('touchstart', unlockPlayback, { passive: true });

  target = current = readProgress();
  showProgress(target);
  /* The src is set here, not in the markup, so visitors without the effect never download the video. */
  startSource(0);

  /* Safety net: whatever happens (no events from the decoder, a stuck download), the loader never stays
     up longer than this. With metadata the page opens with the video, without it the intro is switched off
     and the page works as a normal site. */
  if (loading) {
    window.setTimeout(function () {
      if (!loading) return;
      if (duration) {
        endLoading(true);
      } else {
        abortLoad();
        disable();
      }
    }, 60000);
  }
})();
