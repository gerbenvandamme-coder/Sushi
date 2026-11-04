/* Inertia scrolling for mouse wheel and trackpad.
   The wheel adds to a target position and the page eases towards it every frame, so it keeps gliding
   after the last tick. Anchor links glide with a timed ease on every device. The wheel part is for mouse and trackpad only; touch devices keep native scrolling,
   which already has momentum. Anything that moves the page by other means (keyboard, scrollbar,
   scrollIntoView) is detected in onScroll and takes over. */
(function () {
  'use strict';

  var root = document.documentElement;
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  var RATE = 6.5;            /* higher = shorter glide after you stop scrolling (per second) */
  var WHEEL_MULT = 1;        /* 1 = same distance as the native wheel */
  var LINE_PX = 40;          /* pixels per line for wheels that report lines (Firefox) */
  var STOP_AT = 0.4;         /* px; closer than this counts as arrived */
  var MAX_FRAME_S = 0.05;    /* cap dt so a stalled tab does not jump */
  var WRITE_TOLERANCE = 2;   /* px; a scroll position this close to our last write is ours */
  var TWEEN_MIN_MS = 600;    /* anchor glide: shortest duration */
  var TWEEN_MAX_MS = 1500;   /* anchor glide: longest duration */
  var TWEEN_MS_PER_PX = 0.4; /* anchor glide: duration per pixel of distance, between min and max */
  var DOCK_ZONE = 0.15;      /* last share of the intro runway that glides on to the hero */
  var DOCK_DELAY_MS = 140;   /* idle time before the dock glide starts */

  var current = window.scrollY;
  var target = current;
  var written = current;
  var rafId = 0;
  var lastTime = 0;
  var direction = 0;
  var dockTimer = 0;
  var tween = null;

  function clamp(value, low, high) {
    return value < low ? low : value > high ? high : value;
  }

  function maxScroll() {
    return Math.max(0, root.scrollHeight - window.innerHeight);
  }

  /* Lowest position the glide may reach: once the intro has played, the hero top is the floor,
     so the intro is only re-entered through the swipe gate. */
  function minScroll() {
    return window.sdIntro ? window.sdIntro.floor() : 0;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function write(y) {
    written = y;
    window.scrollTo(0, y);
  }

  function frame(now) {
    var dt = clamp((now - lastTime) / 1000, 0, MAX_FRAME_S);
    var done;
    lastTime = now;
    if (tween) {
      var t = clamp((now - tween.start) / tween.duration, 0, 1);
      current = tween.from + (tween.to - tween.from) * easeInOutCubic(t);
      done = t >= 1;
    } else {
      current += (target - current) * (1 - Math.exp(-RATE * dt));
      done = Math.abs(target - current) < STOP_AT;
      if (done) current = target;
    }
    write(current);
    if (done) {
      rafId = 0;
      tween = null;
      root.classList.remove('glide-on');
      scheduleDock();
      return;
    }
    rafId = window.requestAnimationFrame(frame);
  }

  function start() {
    if (rafId) return;
    root.classList.add('glide-on');
    lastTime = performance.now();
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = 0;
    tween = null;
    root.classList.remove('glide-on');
  }

  /* Timed glide to an absolute position (anchor links and the dock). */
  function glideTo(y) {
    var to = clamp(y, minScroll(), maxScroll());
    window.clearTimeout(dockTimer);
    if (!rafId) current = window.scrollY;
    var distance = Math.abs(to - current);
    if (distance < 1) return;
    direction = to > current ? 1 : -1;
    tween = {
      from: current,
      to: to,
      start: performance.now(),
      duration: clamp(distance * TWEEN_MS_PER_PX, TWEEN_MIN_MS, TWEEN_MAX_MS)
    };
    target = to;
    start();
  }

  /* Replaces the old scroll-snap at the end of the intro: after scrolling down and stopping in the
     last part of the runway, glide on to the hero instead of leaving the page hidden. */
  function dockToHero() {
    var runway = document.getElementById('scrub');
    if (!runway || !root.classList.contains('scrub-on')) return;
    var top = runway.getBoundingClientRect().top + window.scrollY;
    var end = top + runway.offsetHeight - window.innerHeight;
    var span = end - top;
    var y = window.scrollY;
    if (span > 0 && y >= end - span * DOCK_ZONE && y < end - 1) glideTo(end);
  }

  function scheduleDock() {
    window.clearTimeout(dockTimer);
    if (direction > 0) dockTimer = window.setTimeout(dockToHero, DOCK_DELAY_MS);
  }

  /* True when the wheel is over an element that can still scroll in that direction itself. */
  function scrollsInside(el, dy) {
    while (el && el !== document.body && el !== root) {
      if (el.nodeType === 1) {
        var oy = window.getComputedStyle(el).overflowY;
        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
          var canScroll = dy < 0 ? el.scrollTop > 0 : el.scrollTop + el.clientHeight < el.scrollHeight - 1;
          if (canScroll) return true;
        }
      }
      el = el.parentElement;
    }
    return false;
  }

  function onWheel(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.shiftKey) return; /* ctrl + wheel is zoom */
    if (document.body.classList.contains('locked')) return;                  /* cart drawer is open */
    if (e.deltaY === 0 || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    if (root.classList.contains('scrub-loading')) return;                    /* video still loading */
    if (scrollsInside(e.target, e.deltaY)) return;

    var unit = e.deltaMode === 1 ? LINE_PX : e.deltaMode === 2 ? window.innerHeight : 1;
    var delta = e.deltaY * unit * WHEEL_MULT;
    e.preventDefault();
    window.clearTimeout(dockTimer);
    if (!rafId) {
      current = window.scrollY;
      target = current;
    } else if (tween) {
      tween = null;
      target = current;
    }
    direction = delta > 0 ? 1 : -1;
    target = clamp(target + delta, minScroll(), maxScroll());
    start();
  }

  /* Any scroll position that is not our own last write comes from somewhere else: follow it. */
  function onScroll() {
    if (Math.abs(window.scrollY - written) <= WRITE_TOLERANCE) return;
    stop();
    window.clearTimeout(dockTimer);
    current = target = written = window.scrollY;
  }

  function onAnchorClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link || link.classList.contains('skip-link')) return;
    var hash = link.getAttribute('href');
    if (!hash || hash.length < 2) return;
    var dest = null;
    try {
      dest = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (err) {
      return;
    }
    if (!dest) return;

    e.preventDefault();
    if (window.sdIntro) window.sdIntro.skip();

    try {
      window.history.pushState(null, '', hash);
    } catch (err) {
      /* Some contexts (file:// in old browsers) block pushState; the scroll still works. */
    }

    /* Touch devices: skip the per-frame JS glide entirely. It fights the mobile URL-bar
       height change (maxScroll clamp) and the sub-pixel ownership race in onScroll, which is
       what made anchor taps jitter or stop short on iOS / Android. A one-shot native scroll
       on the next frame — after skip() has collapsed the intro runway and the layout has
       settled — is smooth and reliable there. scroll-padding-top handles the sticky header. */
    if (coarse) {
      stop();
      window.requestAnimationFrame(function () {
        var padding = parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0;
        var margin = parseFloat(window.getComputedStyle(dest).scrollMarginTop) || 0;
        var y = dest.getBoundingClientRect().top + window.scrollY - padding - margin;
        y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
        window.scrollTo({ top: y, left: 0, behavior: 'smooth' });
      });
      return;
    }

    var padding = parseFloat(window.getComputedStyle(root).scrollPaddingTop) || 0;
    var margin = parseFloat(window.getComputedStyle(dest).scrollMarginTop) || 0;
    glideTo(dest.getBoundingClientRect().top + window.scrollY - padding - margin);
  }

  /* The intro gate calls this when it takes over the scroll position. */
  window.sdSmooth = {
    halt: function () {
      stop();
      window.clearTimeout(dockTimer);
      current = target = written = window.scrollY;
    }
  };

  if (fine) {
    root.classList.add('smooth-on');
    window.addEventListener('wheel', onWheel, { passive: false });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('click', onAnchorClick);
})();
