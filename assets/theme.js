/**
 * Dein-Sportauspuff.de - Central Theme & Tailwind Configuration
 * Shared across index.html, kategorie.html, detail.html, konto.html
 */

// 1. Tailwind Configuration
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          brand: {
            blue: '#378DCC',
            blueHover: '#2875AB',
            blueBright: '#5CAAE3',
            blueLight: '#EBF4FB',
            accent: '#F59E0B',
            accentHover: '#D97706',
            // Backward-compatibility aliases for orange utility classes
            orange: '#378DCC',
            orangeHover: '#2875AB',
            orangeBright: '#5CAAE3',
            orangeLight: '#EBF4FB'
          }
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          racing: ['"Barlow Condensed"', 'sans-serif']
        }
      }
    }
  };
}

// 2. Robust Theme Manager
function setTheme(theme) {
  const body = document.getElementById('appBody') || document.body;
  const btnDark = document.getElementById('btnDarkTheme');
  const btnLight = document.getElementById('btnLightTheme');
  const quickIcon = document.getElementById('themeQuickIcon');

  if (theme === 'light') {
    if (body) body.classList.add('theme-light');
    if (btnLight) {
      btnLight.className = "px-3 py-1.5 rounded-xl text-xs font-racing uppercase tracking-wider font-extrabold flex items-center space-x-1.5 transition bg-brand-orange text-white shadow";
    }
    if (btnDark) {
      btnDark.className = "px-3 py-1.5 rounded-xl text-xs font-racing uppercase tracking-wider font-extrabold flex items-center space-x-1.5 transition text-gray-300 hover:text-white hover:bg-white/10";
    }
    if (quickIcon) {
      quickIcon.className = "fa-solid fa-moon text-sm";
    }
    localStorage.setItem('sportauspuff_theme', 'light');
  } else {
    if (body) body.classList.remove('theme-light');
    if (btnDark) {
      btnDark.className = "px-3 py-1.5 rounded-xl text-xs font-racing uppercase tracking-wider font-extrabold flex items-center space-x-1.5 transition bg-brand-orange text-white shadow";
    }
    if (btnLight) {
      btnLight.className = "px-3 py-1.5 rounded-xl text-xs font-racing uppercase tracking-wider font-extrabold flex items-center space-x-1.5 transition text-gray-300 hover:text-white hover:bg-white/10";
    }
    if (quickIcon) {
      quickIcon.className = "fa-solid fa-sun text-sm";
    }
    localStorage.setItem('sportauspuff_theme', 'dark');
  }
}

function toggleThemeQuick() {
  const body = document.getElementById('appBody') || document.body;
  const isLight = body ? body.classList.contains('theme-light') : false;
  setTheme(isLight ? 'dark' : 'light');
}

function getUrlParams() {
  if (typeof window !== 'undefined' && window.location) {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
}

function initTheme() {
  const urlParams = window.urlParams || getUrlParams();
  const urlTheme = urlParams.get('theme');
  const savedTheme = localStorage.getItem('sportauspuff_theme');

  if (urlTheme === 'light' || (!urlTheme && savedTheme === 'light')) {
    setTheme('light');
  } else if (urlTheme === 'dark' || (!urlTheme && savedTheme === 'dark')) {
    setTheme('dark');
  }
}

// 3. Gapless Dropdown & Mega-Menu Logic
function initDropdowns() {
  document.querySelectorAll('.dropdown-group').forEach(group => {
    const trigger = group.querySelector('.dropdown-trigger');
    const panel = group.querySelector('.dropdown-panel');
    if (!trigger || !panel) return;

    // Remove existing listener clone to avoid duplicate listeners
    const newTrigger = trigger.cloneNode(true);
    trigger.parentNode.replaceChild(newTrigger, trigger);

    newTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = panel.classList.contains('is-open');
      document.querySelectorAll('.dropdown-panel.is-open').forEach(p => {
        if (p !== panel) p.classList.remove('is-open');
      });
      document.querySelectorAll('.dropdown-group.is-open').forEach(g => {
        if (g !== group) g.classList.remove('is-open');
      });
      if (!isOpen) {
        panel.classList.add('is-open');
        group.classList.add('is-open');
      } else {
        panel.classList.remove('is-open');
        group.classList.remove('is-open');
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-group')) {
      document.querySelectorAll('.dropdown-panel.is-open').forEach(p => p.classList.remove('is-open'));
      document.querySelectorAll('.dropdown-group.is-open').forEach(g => g.classList.remove('is-open'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-panel.is-open').forEach(p => p.classList.remove('is-open'));
      document.querySelectorAll('.dropdown-group.is-open').forEach(g => g.classList.remove('is-open'));
    }
  });
}

// Global Exports
window.setTheme = setTheme;
window.toggleThemeQuick = toggleThemeQuick;
window.initDropdowns = initDropdowns;
window.getUrlParams = getUrlParams;
window.urlParams = getUrlParams();

// Self-initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDropdowns();
  });
} else {
  initTheme();
  initDropdowns();
}
