/* Intro switch: the scroll intro (video) is opt-in and off by default.
   The choice is stored in localStorage ('sushidai.intro' = 'on' | 'off') and read by the inline script in
   index.html before first paint. The intro is started or removed at page load, so changing the switch reloads the page. */
(function () {
  'use strict';

  var KEY = 'sushidai.intro';
  var buttons = document.querySelectorAll('[data-intro-toggle]');
  if (!buttons.length) return;

  /* Visitors who asked for reduced motion never get the intro, so the switch would do nothing. */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    buttons.forEach(function (btn) { btn.remove(); });
    return;
  }

  function isOn() {
    try {
      return window.localStorage.getItem(KEY) === 'on';
    } catch (err) {
      return false;
    }
  }

  function save(on) {
    try {
      window.localStorage.setItem(KEY, on ? 'on' : 'off');
      return true;
    } catch (err) {
      return false; /* Storage blocked: the choice cannot be kept, so the intro stays off. */
    }
  }

  function render() {
    var on = isOn();
    var action = on ? 'Intro-animatie uitzetten' : 'Intro-animatie aanzetten';
    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.setAttribute('aria-label', action);
      btn.title = action;
      var label = btn.querySelector('[data-intro-label]');
      if (label) label.textContent = action;
    });
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (!save(!isOn())) return;
      window.location.reload();
    });
  });

  render();
})();