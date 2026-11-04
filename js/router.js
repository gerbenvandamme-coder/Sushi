/* Hash router. "#/menu" is the menu page, every other hash is the home page.
   CSS does the hiding (html.route-menu); this keeps the class, title and scroll position in sync. */
(function () {
  var root = document.documentElement;
  var homeTitle = document.title;
  var menuTitle = 'Menu | Sushi Dai';

  function isMenuHash() {
    return window.location.hash.replace(/\/+$/, '') === '#/menu';
  }

  function scrollToTop() {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch (err) {
      window.scrollTo(0, 0);
    }
  }

  /* Leaving the menu: the target section was hidden when the browser tried to scroll, so do it here. */
  function scrollToHash() {
    var hash = window.location.hash;
    if (hash.length < 2 || hash.charAt(1) === '/') {
      scrollToTop();
      return;
    }
    var target = null;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch (err) {
      target = null;
    }
    if (target) target.scrollIntoView();
    else scrollToTop();
  }

  function apply(initial) {
    var menu = isMenuHash();
    if (menu === root.classList.contains('route-menu') && !initial) return;

    root.classList.toggle('route-menu', menu);
    document.title = menu ? menuTitle : homeTitle;

    if (menu) {
      /* The intro clip belongs to the home page: collapse it so the menu opens straight away. */
      if (window.sdIntro && typeof window.sdIntro.skip === 'function') window.sdIntro.skip();
      if (!initial) {
        scrollToTop();
        var heading = document.getElementById('kaart-title');
        if (heading) {
          heading.setAttribute('tabindex', '-1');
          heading.focus({ preventScroll: true });
        }
      }
      /* The menu was display:none while it rendered; let layout code re-measure it. */
      window.requestAnimationFrame(function () {
        window.dispatchEvent(new Event('resize'));
      });
    } else if (!initial) {
      scrollToHash();
    }
  }

  /* On the menu page, links to home sections (logo, "Signature Boten", "Info") must leave the menu first.
     The generic anchor handler uses pushState, which fires no hashchange, so route them through location.hash. */
  document.addEventListener('click', function (e) {
    if (!isMenuHash() || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!link || link.classList.contains('skip-link')) return;
    var hash = link.getAttribute('href');
    if (!hash || hash.length < 2 || hash.charAt(1) === '/') return;
    e.preventDefault();
    window.location.hash = hash;
  }, true);

  window.addEventListener('hashchange', function () { apply(false); });
  apply(true);
})();
