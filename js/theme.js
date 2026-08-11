(() => {
  const STORAGE_KEY = 'glitchlabs-accent';
  const ACCENTS = [
    {
      id: 'midnight',
      label: 'Midnight',
      hex: '#9bb0c9',
      hover: '#b4c4d8',
    },
    {
      id: 'dawn',
      label: 'Dawn',
      hex: '#e2b39a',
      hover: '#ebc4b0',
    },
    {
      id: 'morning',
      label: 'Morning',
      hex: '#d8c4a0',
      hover: '#e4d2b2',
    },
    {
      id: 'day',
      label: 'Day',
      hex: '#8fbfb0',
      hover: '#a6cec2',
    },
    {
      id: 'dusk',
      label: 'Dusk',
      hex: '#c9a48a',
      hover: '#d7b69f',
    },
    {
      id: 'night',
      label: 'Night',
      hex: '#b8a9c9',
      hover: '#cbbfd8',
    },
  ];

  const accentById = Object.fromEntries(ACCENTS.map((a) => [a.id, a]));

  function accentFromTime(date = new Date()) {
    const index = Math.floor(date.getHours() / 4);
    return ACCENTS[index] || ACCENTS[0];
  }

  function readPreference() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      if (!value || value === 'auto') return 'auto';
      if (accentById[value]) return value;
    } catch (_) {
      /* ignore */
    }
    return 'auto';
  }

  function writePreference(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {
      /* ignore */
    }
  }

  function resolveAccent(preference) {
    if (preference === 'auto') return accentFromTime();
    return accentById[preference] || accentFromTime();
  }

  function applyAccent(accent, preference) {
    const root = document.documentElement;
    root.dataset.accent = accent.id;
    root.dataset.accentMode = preference === 'auto' ? 'auto' : 'manual';
    root.style.setProperty('--accent', accent.hex);
    root.style.setProperty('--accent-hover', accent.hover);
    root.style.setProperty('--accent-soft', `color-mix(in srgb, ${accent.hex} 18%, transparent)`);
  }

  function refreshFromPreference() {
    const preference = readPreference();
    const accent = resolveAccent(preference);
    applyAccent(accent, preference);
    return { preference, accent };
  }

  // Apply before paint when possible
  const initial = refreshFromPreference();

  function buildPicker() {
    if (document.querySelector('.accent-helper')) return;

    const helper = document.createElement('div');
    helper.className = 'accent-helper';
    helper.setAttribute('data-open', 'false');

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'accent-helper-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'accent-helper-panel');
    toggle.setAttribute('aria-label', 'Accent color');
    toggle.innerHTML = '<span class="accent-helper-swatch" aria-hidden="true"></span>';

    const panel = document.createElement('div');
    panel.className = 'accent-helper-panel';
    panel.id = 'accent-helper-panel';
    panel.hidden = true;

    const autoBtn = document.createElement('button');
    autoBtn.type = 'button';
    autoBtn.className = 'accent-helper-auto';
    autoBtn.dataset.value = 'auto';
    autoBtn.textContent = 'Auto';
    autoBtn.title = 'Follow time of day';
    panel.appendChild(autoBtn);

    ACCENTS.forEach((accent) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'accent-helper-dot';
      btn.dataset.value = accent.id;
      btn.title = accent.label;
      btn.setAttribute('aria-label', accent.label);
      btn.style.setProperty('--swatch', accent.hex);
      panel.appendChild(btn);
    });

    helper.appendChild(panel);
    helper.appendChild(toggle);
    document.body.appendChild(helper);

    function syncUi() {
      const preference = readPreference();
      const accent = resolveAccent(preference);
      applyAccent(accent, preference);

      const swatch = toggle.querySelector('.accent-helper-swatch');
      if (swatch) swatch.style.background = accent.hex;

      panel.querySelectorAll('[data-value]').forEach((el) => {
        const active = el.dataset.value === preference;
        el.setAttribute('aria-pressed', active ? 'true' : 'false');
        el.classList.toggle('is-active', active);
      });
    }

    function setOpen(open) {
      helper.dataset.open = open ? 'true' : 'false';
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.hidden = !open;
    }

    toggle.addEventListener('click', () => {
      setOpen(helper.dataset.open !== 'true');
    });

    panel.addEventListener('click', (event) => {
      const target = event.target.closest('[data-value]');
      if (!target) return;
      writePreference(target.dataset.value);
      syncUi();
      setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!helper.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    // Re-apply when crossing hour slots while left on Auto
    setInterval(() => {
      if (readPreference() === 'auto') syncUi();
    }, 60 * 1000);

    syncUi();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPicker);
  } else {
    buildPicker();
  }

  // Expose for debugging / future use
  window.gLitChTheme = {
    accents: ACCENTS,
    refresh: refreshFromPreference,
    initial,
  };
})();
