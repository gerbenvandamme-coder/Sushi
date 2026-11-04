/* Intro gate: the lock-screen swipe.
   The intro does not follow the scroll one wheel tick at a time. One decisive swipe (wheel flick,
   trackpad swipe, touch swipe, or Space / arrow down) plays the whole video and docks the hero.
   A soft swipe only nudges the video and it springs back. The same swipe upwards at the top of the
   hero plays the intro in reverse.
   The gate drives the page by writing window.scrollY, so the scrub script (which reads the scroll
   position) keeps working unchanged. */
(function () {
  'use strict';

  var root = document.documentElement;
  var runway = document.getElementById('scrub');
  if (!runway || !root.classList.contains('scrub-on')) return;

  var PLAY_MS = 3600;          /* the whole video, start to end */
  var MIN_ANIM_MS = 420;       /* shortest animation, used for the spring back */
  var PREVIEW = 0.1;           /* share of the video a soft swipe may move before it springs back */
  var COMMIT_WHEEL_PX = 80;    /* wheel or trackpad distance within one gesture that counts as a swipe */
  var WHEEL_IDLE_MS = 170;     /* no wheel events for this long ends the gesture */
  var GESTURE_GAP_MS = 350;    /* quiet time needed before a pull from the hero top can start */
  var COMMIT_TOUCH_VH = 0.18;  /* touch: drag distance (share of viewport height) that counts as a swipe */
  var COMMIT_TOUCH_MIN_PX = 90;
  var FLING_MIN_PX = 36;       /* touch: shortest drag that still counts when it is fast */
  var FLING_PX_PER_MS = 0.5;   /* touch: speed that counts as a flick */
  var LINE_PX = 40;            /* pixels per line for wheels that report lines (Firefox) */
  var SETTLE_IDLE_MS = 160;    /* idle time before an outside scroll is settled to the nearest end */
  var EDGE_PX = 2;             /* px; a scroll position this close to our last write is ours */
  var HERO_TOL_PX = 64;        /* px; this close to the end of the runway counts as "at the hero" */

  var state = 'rest';          /* 'rest' | 'drag' | 'anim' */
  var home = 0;                /* 0 = intro start, 1 = hero (intro played) */
  var pos = 0;                 /* progress currently shown, 0 to 1 */
  var written = window.scrollY;
  var anim = null;
  var rafId = 0;
  var releaseTimer = 0;
  var settleTimer = 0;
  var lastOther = 0;
  var pull = 0;
  var startShift = 0;
  var touch = null;

  function enabled() {
    return root.classList.contains('scrub-on') && !root.classList.contains('scrub-loading') && !root.classList.contains('route-menu');
  }

  function clamp(value, low, high) {
    return value < low ? low : value > high ? high : value;
  }

  /* Fast start, long soft landing: most of the video passes in the first half of the swipe. */
  function easePlay(t) {
    return 1 - Math.pow(1 - t, 2.2);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function geometry() {
    return {
      top: runway.getBoundingClientRect().top + window.scrollY,
      span: Math.max(0, runway.offsetHeight - window.innerHeight)
    };
  }

  function endY() {
    var g = geometry();
    return g.top + g.span;
  }

  function atHero() {
    return window.scrollY >= endY() - HERO_TOL_PX;
  }

  function progressNow() {
    var g = geometry();
    return g.span > 0 ? clamp((window.scrollY - g.top) / g.span, 0, 1) : 1;
  }

  function writePos(p) {
    var g = geometry();
    pos = p;
    written = g.top + p * g.span;
    window.scrollTo(0, written);
  }

  function setZone(on) {
    root.classList.toggle('intro-zone', on);
  }

  function haltSmooth() {
    if (window.sdSmooth) window.sdSmooth.halt();
  }

  function swallow(e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
  }

  function stopAnim() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    anim = null;
  }

  function finish(to) {
    stopAnim();
    writePos(to);
    home = to;
    state = 'rest';
    pull = 0;
    lastOther = performance.now();
    setZone(to === 0);
  }

  function step(now) {
    var t = clamp((now - anim.start) / anim.duration, 0, 1);
    writePos(anim.from + (anim.to - anim.from) * anim.ease(t));
    if (t >= 1) {
      finish(anim.to);
      return;
    }
    rafId = window.requestAnimationFrame(step);
  }

  /* kind 'play' runs the video and ignores input until it is done; 'back' is a short spring
     that a new swipe may interrupt. */
  function animateTo(to, kind) {
    stopAnim();
    window.clearTimeout(releaseTimer);
    var distance = Math.abs(to - pos);
    if (distance < 0.0005) {
      finish(to);
      return;
    }
    state = 'anim';
    setZone(true);
    anim = {
      kind: kind,
      from: pos,
      to: to,
      start: performance.now(),
      duration: clamp(distance * PLAY_MS, MIN_ANIM_MS, PLAY_MS),
      ease: kind === 'play' ? easePlay : easeOutCubic
    };
    rafId = window.requestAnimationFrame(step);
  }

  function commit() {
    window.clearTimeout(releaseTimer);
    animateTo(home === 0 ? 1 : 0, 'play');
  }

  function release() {
    if (state !== 'drag') return;
    window.clearTimeout(releaseTimer);
    pull = 0;
    animateTo(home, 'back');
  }

  function beginPull() {
    stopAnim();
    haltSmooth();
    window.clearTimeout(settleTimer);
    state = 'drag';
    pull = 0;
    startShift = Math.min(Math.abs(pos - home), PREVIEW);
    setZone(true);
  }

  /* amount: 0 to 1 of the distance needed to commit. */
  function preview(amount) {
    var shift = startShift + (PREVIEW - startShift) * clamp(amount, 0, 1);
    writePos(home === 0 ? shift : 1 - shift);
  }

  /* ----- wheel and trackpad ----- */
  function canStartWheel(dy, now) {
    if (home === 0) return dy > 0;
    return dy < 0 && window.scrollY <= endY() + EDGE_PX && now - lastOther >= GESTURE_GAP_MS;
  }

  function onWheel(e) {
    if (!enabled() || e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (document.body.classList.contains('locked')) return;
    var unit = e.deltaMode === 1 ? LINE_PX : e.deltaMode === 2 ? window.innerHeight : 1;
    var dy = e.deltaY * unit;
    if (dy === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var now = performance.now();

    if (state === 'anim' && anim && anim.kind === 'play') {
      swallow(e);
      return;
    }
    if (state !== 'drag' && !canStartWheel(dy, now)) {
      lastOther = now;
      return;
    }
    swallow(e);
    if (state !== 'drag') beginPull();
    pull = Math.max(0, pull + (home === 0 ? dy : -dy));
    if (pull >= COMMIT_WHEEL_PX) {
      commit();
      return;
    }
    preview(pull / COMMIT_WHEEL_PX);
    window.clearTimeout(releaseTimer);
    releaseTimer = window.setTimeout(release, WHEEL_IDLE_MS);
  }

  /* ----- touch ----- */
  function touchCommitPx() {
    return Math.max(COMMIT_TOUCH_MIN_PX, window.innerHeight * COMMIT_TOUCH_VH);
  }

  function canStartTouch(dy) {
    if (home === 0) return dy > 0;
    return dy < 0 && window.scrollY <= endY() + EDGE_PX;
  }

  function onTouchStart(e) {
    touch = null;
    if (!enabled() || e.touches.length !== 1) return;
    if (document.body.classList.contains('locked')) return;
    var point = e.touches[0];
    touch = { y0: point.clientY, y: point.clientY, t: performance.now(), v: 0, mode: '' };
  }

  function onTouchMove(e) {
    if (!touch || !enabled() || !e.touches.length) return;
    var point = e.touches[0];
    var now = performance.now();
    var dt = now - touch.t;
    /* Positive = finger moving up = the page wants to go down. */
    var dy = touch.y0 - point.clientY;
    if (dt > 0) touch.v = touch.v * 0.6 + ((touch.y - point.clientY) / dt) * 0.4;
    touch.y = point.clientY;
    touch.t = now;

    if (state === 'anim' && anim && anim.kind === 'play') {
      swallow(e);
      return;
    }
    if (!touch.mode) {
      if (Math.abs(dy) < 6) return;
      touch.mode = canStartTouch(dy) ? 'pull' : 'native';
      if (touch.mode === 'pull') beginPull();
    }
    if (touch.mode !== 'pull' || state !== 'drag') return;
    swallow(e);
    pull = Math.max(0, home === 0 ? dy : -dy);
    preview(pull / touchCommitPx());
  }

  function onTouchEnd(e) {
    var done = touch;
    touch = null;
    if (!done || done.mode !== 'pull' || state !== 'drag') return;
    var speed = home === 0 ? done.v : -done.v;
    if (performance.now() - done.t > 80) speed = 0; /* the finger rested before lifting */
    if (e.type !== 'touchcancel' && (pull >= touchCommitPx() || (pull >= FLING_MIN_PX && speed >= FLING_PX_PER_MS))) {
      commit();
    } else {
      release();
    }
  }

  /* ----- keyboard ----- */
  function onKeyDown(e) {
    if (!enabled() || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (document.body.classList.contains('locked')) return;
    var key = e.key;
    var space = key === ' ' || key === 'Spacebar';
    if (!(space || key === 'PageDown' || key === 'ArrowDown')) return;
    var target = e.target;
    if (target && target.closest) {
      if (target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (space && target.closest('button, a, summary')) return;
    }
    if (state === 'anim' && anim && anim.kind === 'play') {
      e.preventDefault();
      return;
    }
    if (home === 0) {
      e.preventDefault();
      haltSmooth();
      commit();
    }
  }

  /* ----- scrolling by other means (scrollbar, anchors, Tab focus, restored position) ----- */
  function settle() {
    if (!enabled() || state !== 'rest') return;
    if (atHero()) {
      home = 1;
      pos = 1;
      written = window.scrollY;
      setZone(false);
      return;
    }
    pos = progressNow();
    animateTo(pos >= 0.5 ? 1 : 0, pos >= 0.5 ? 'play' : 'back');
  }

  function onScroll() {
    if (!enabled() || state !== 'rest') return;
    if (Math.abs(window.scrollY - written) <= EDGE_PX) return;
    if (home === 1 && atHero()) {
      written = window.scrollY; /* ordinary scrolling on the page below the intro */
      return;
    }
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, SETTLE_IDLE_MS);
  }

  /* Lets the inertia scroller know where it must stop. */
  window.sdIntro = {
    floor: function () {
      return enabled() && home === 1 ? endY() : 0;
    },
    /* An anchor link was used while the swipe animation or a drag is still running: finish the intro
       at once, so the animation cannot pull the page back up afterwards. */
    skip: function () {
      if (!enabled() || state === 'rest') return;
      window.clearTimeout(releaseTimer);
      touch = null;
      finish(1);
    }
  };

  home = atHero() ? 1 : 0;
  pos = home;
  written = home === 0 ? 0 : window.scrollY;
  setZone(home === 0);

  window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  document.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false, capture: true });
  document.addEventListener('touchend', onTouchEnd, { capture: true });
  document.addEventListener('touchcancel', onTouchEnd, { capture: true });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('scroll', onScroll, { passive: true });

  /* The loader hides the page until the video is loaded; sync with the scroll position at that moment. */
  window.addEventListener('sd:video-ready', function () {
    if (state !== 'rest') return;
    home = atHero() ? 1 : 0;
    pos = home;
    written = home === 0 ? 0 : window.scrollY;
    setZone(home === 0);
    if (home === 0 && window.scrollY > EDGE_PX) settle();
  });

  if (home === 0 && window.scrollY > EDGE_PX) settle();
})();
