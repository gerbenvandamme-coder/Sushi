/* Zoom lock. The viewport meta tag already forbids zooming; these handlers cover browsers that ignore it. */
(function () {
  'use strict';

  var options = { passive: false };

  function block(e) {
    if (e.cancelable) e.preventDefault();
  }

  /* iOS Safari ignores user-scalable=no. Its pinch gesture fires gesture events. */
  ['gesturestart', 'gesturechange', 'gestureend'].forEach(function (type) {
    document.addEventListener(type, block, options);
  });

  /* Everywhere else: ignore any touch movement with two or more fingers. */
  document.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches.length > 1) block(e);
  }, options);

  /* Trackpad pinch and ctrl + wheel arrive as a wheel event with ctrlKey set. */
  window.addEventListener('wheel', function (e) {
    if (e.ctrlKey) block(e);
  }, options);
})();
