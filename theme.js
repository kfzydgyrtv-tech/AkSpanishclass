(() => {
  const storageKey = 'ak-spanish-class-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const root = document.documentElement;
  const icons = {
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42m0-14.14-1.42 1.42M6.35 17.65l-1.42 1.42"/>',
    dark: '<path d="M20.9 13.35A9 9 0 0 1 10.65 3.1 9 9 0 1 0 20.9 13.35Z"/>',
  };
  let preference;

  function readPreference() {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved === 'dark' || saved === 'light' ? saved : undefined;
    } catch {
      return undefined;
    }
  }

  function applyTheme() {
    const theme = preference ?? (systemTheme.matches ? 'dark' : 'light');
    root.dataset.theme = theme;
    const button = document.querySelector('[data-theme-toggle]');
    if (button) updateToggle(button, theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#171a17' : '#f8f3e9';
  }

  function updateToggle(button, theme) {
    const previous = button.dataset.mode;
    if (previous === theme) return;
    if (!previous) button.setAttribute('aria-label', button.textContent.trim());
    button.dataset.mode = theme;
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    button.innerHTML = `<svg data-theme-icon="${theme === 'dark' ? 'moon' : 'sun'}" aria-hidden="true" focusable="false"
      width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[theme]}</svg>`;

    if (previous && !reducedMotion.matches) {
      button.firstElementChild.animate?.([
        { opacity: 0, transform: 'rotate(-22deg) scale(.72)' },
        { opacity: 1, transform: 'rotate(0deg) scale(1)' },
      ], { duration: 220, easing: 'ease-out' });
    }
  }

  preference = readPreference();
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;
    applyTheme();
    button.hidden = false;
    button.addEventListener('click', () => {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(storageKey, preference);
      } catch {
        // The current page can still change theme when storage is unavailable.
      }
      applyTheme();
    });
  });
  systemTheme.addEventListener('change', applyTheme);
  window.addEventListener('storage', (event) => {
    if (event.key === storageKey || event.key === null) {
      preference = readPreference();
      applyTheme();
    }
  });
})();
