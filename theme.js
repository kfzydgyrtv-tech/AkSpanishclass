(() => {
  const storageKey = 'ak-spanish-class-theme';
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
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
    button?.setAttribute('aria-pressed', String(theme === 'dark'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#171a17' : '#f8f3e9';
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
