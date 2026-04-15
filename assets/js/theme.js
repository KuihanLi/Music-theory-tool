(function () {
  var KEY = 'mt.theme';
  var root = document.documentElement;
  var themes = ['slate', 'parchment', 'night'];
  var animTimer = null;

  function applyTheme(theme) {
    var next = themes.includes(theme) ? theme : 'slate';
    root.classList.add('theme-animating');
    if (animTimer) {
      clearTimeout(animTimer);
    }
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(KEY, next);
    } catch (e) {}
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute('data-theme-choice') === next);
    });
    animTimer = setTimeout(function () {
      root.classList.remove('theme-animating');
      animTimer = null;
    }, 260);
  }

  function init() {
    var saved = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch (e) {}
    applyTheme(saved || 'slate');
    document.querySelectorAll('[data-theme-choice]').forEach(function (button) {
      button.addEventListener('click', function () {
        applyTheme(button.getAttribute('data-theme-choice'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
