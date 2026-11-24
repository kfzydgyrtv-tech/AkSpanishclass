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
    const spanish = root.lang.toLowerCase().startsWith('es');
    const action = theme === 'dark' ? (spanish ? 'Cambiar a modo claro' : 'Switch to light mode') : (spanish ? 'Cambiar a modo oscuro' : 'Switch to dark mode');
    button.setAttribute('aria-label', action);
    button.title = action;
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

/* Decorative enhancements: no external requests, no changes to student data. */
document.addEventListener('DOMContentLoaded', () => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const flips = new WeakMap();
  document.addEventListener('click', event => {
    const card = event.target.closest?.('.flash-stage, #fc-flip');
    if (!card || motion.matches || !card.animate || card.disabled) return;
    flips.get(card)?.cancel();
    flips.set(card, card.animate([
      {transform:'perspective(800px) rotateY(-16deg)',opacity:.72},
      {transform:'perspective(800px) rotateY(0deg)',opacity:1}
    ],{duration:220,easing:'ease-out'}));
  });
  motion.addEventListener?.('change', () => {
    if(motion.matches) document.querySelectorAll('.flash-stage,#fc-flip').forEach(card=>flips.get(card)?.cancel());
  });
  const note = document.getElementById('culture-note');
  if (!note) return;
  const date = new Date(), month = date.getMonth()+1, day = date.getDate();
  const events = [
    [1,5,6,'Día de Reyes','In Spain and many Latin American communities, January 6 is associated with the Three Kings. Traditions vary by region.'],
    [4,23,23,'Día del Libro','April 23 celebrates books and reading. Try reading a short Spanish story today.'],
    [9,15,16,'Independence in Central America and Mexico','Several Central American countries celebrate independence on September 15; Mexico celebrates on September 16.'],
    [11,1,2,'Día de Muertos','In Mexico, many families remember loved ones through ofrendas, flowers and other local traditions.'],
    [12,16,24,'Las Posadas','In Mexico and some other communities, Las Posadas are celebrated in the days leading up to Christmas.']
  ];
  const item=events.find(([m,a,b])=>m===month && day>=a && day<=b);
  if(item){
    document.getElementById('culture-title').textContent=item[3];
    document.getElementById('culture-copy').textContent=item[4];
    note.hidden=false;
  }
});
