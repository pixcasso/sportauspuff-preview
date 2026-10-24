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
            green: 'var(--brand-green)',
            success: 'var(--brand-green)',
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
  const mobBtnDark = document.getElementById('mobBtnDark');
  const mobBtnLight = document.getElementById('mobBtnLight');
  const quickIcon = document.getElementById('themeQuickIcon');
  const floatingBtn = document.getElementById('floatingThemeToggle');

  if (theme === 'light') {
    if (body) body.classList.add('theme-light');
    if (mobBtnLight) {
      mobBtnLight.className = "px-2.5 py-1 rounded-md text-[11px] font-racing font-bold flex items-center space-x-1 bg-brand-orange text-white shadow transition";
    }
    if (mobBtnDark) {
      mobBtnDark.className = "px-2.5 py-1 rounded-md text-[11px] font-racing font-bold flex items-center space-x-1 text-gray-400 hover:text-white transition";
    }
    if (quickIcon) {
      quickIcon.className = "fa-solid fa-moon text-base transition-colors";
    }
    if (floatingBtn) {
      floatingBtn.setAttribute('title', 'Zu Dark Mode wechseln');
    }
    localStorage.setItem('sportauspuff_theme', 'light');
  } else {
    if (body) body.classList.remove('theme-light');
    if (mobBtnDark) {
      mobBtnDark.className = "px-2.5 py-1 rounded-md text-[11px] font-racing font-bold flex items-center space-x-1 bg-brand-orange text-white shadow transition";
    }
    if (mobBtnLight) {
      mobBtnLight.className = "px-2.5 py-1 rounded-md text-[11px] font-racing font-bold flex items-center space-x-1 text-gray-400 hover:text-white transition";
    }
    if (quickIcon) {
      quickIcon.className = "fa-solid fa-sun text-base text-amber-400 transition-colors";
    }
    if (floatingBtn) {
      floatingBtn.setAttribute('title', 'Zu Light Mode wechseln');
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

// 4. Live Search Preview Dropdown Logic
function initSearchPreview() {
  const searchInput = document.getElementById('search_keys');
  const dropdown = document.getElementById('searchPreviewDropdown');
  if (!searchInput || !dropdown) return;

  function openDropdown() {
    dropdown.classList.remove('hidden');
  }

  function closeDropdown() {
    dropdown.classList.add('hidden');
  }

  searchInput.addEventListener('focus', openDropdown);
  searchInput.addEventListener('click', (e) => {
    e.stopPropagation();
    openDropdown();
  });

  // Trend-Pills Klick: Begriff direkt einsetzen & Dropdown offen halten
  dropdown.querySelectorAll('.search-trend-pill').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const term = pill.getAttribute('data-search-term') || pill.textContent.trim();
      searchInput.value = term;
      searchInput.focus();
    });
  });

  // Klick innerhalb des Dropdowns nicht nach außen weiterleiten
  dropdown.addEventListener('click', (e) => {
    // Falls Klick auf Link oder Button, Link folgen lassen, sonst stopPropagation
    if (e.target.closest('a')) {
      return;
    }
    e.stopPropagation();
  });

  // Outside Click schließt Dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#searchForm') && !e.target.closest('#searchPreviewDropdown')) {
      closeDropdown();
    }
  });

  // Escape-Taste schließt Dropdown
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  });
}

// Global Exports
window.setTheme = setTheme;
window.toggleThemeQuick = toggleThemeQuick;
window.initDropdowns = initDropdowns;
window.initSearchPreview = initSearchPreview;
window.getUrlParams = getUrlParams;
window.urlParams = getUrlParams();

// Self-initialization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDropdowns();
    initSearchPreview();
  });
} else {
  initTheme();
  initDropdowns();
  initSearchPreview();
}

// 5. Central Mobile Drawer Toggle with Icon Animation
function toggleMobileDrawer() {
  const drawer = document.getElementById('mobileDrawer');
  const icon = document.getElementById('mobileMenuIcon');
  if (!drawer) return;
  const isHidden = drawer.classList.contains('hidden');
  if (isHidden) {
    drawer.classList.remove('hidden');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  } else {
    drawer.classList.add('hidden');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }
}
window.toggleMobileDrawer = toggleMobileDrawer;
