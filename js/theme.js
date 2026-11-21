
(function () {
  'use strict';

  const STORAGE_KEY = 'theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /**
   * Determine the active theme based on localStorage, falling back to OS preference.
   * @returns {'dark' | 'light'}
   */
  function getPreferredTheme() {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    if (storedTheme === THEME_DARK || storedTheme === THEME_LIGHT) {
      return storedTheme;
    }
    return mediaQuery.matches ? THEME_DARK : THEME_LIGHT;
  }

  /**
   * Apply the theme to the root element and sync UI controls.
   * @param {'dark' | 'light'} theme
   * @param {boolean} persist - Whether to write to localStorage
   */
  function applyTheme(theme, persist = false) {
    document.documentElement.setAttribute('data-theme', theme);

    if (persist) {
      localStorage.setItem(STORAGE_KEY, theme);
    }

    syncToggleButton(theme);
  }

  /**
   * Sync the theme toggle button's text, icon, and accessibility attributes.
   * @param {'dark' | 'light'} theme
   */
  function syncToggleButton(theme) {
    const toggleBtn = document.getElementById('theme-toggle');
    if (!toggleBtn) return;

    const iconSpan = toggleBtn.querySelector('.theme-icon');
    const labelSpan = toggleBtn.querySelector('.theme-label');
    const isDark = theme === THEME_DARK;

    toggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    toggleBtn.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );

    if (iconSpan) {
      iconSpan.textContent = isDark ? '🌙' : '☀️';
    }

    if (labelSpan) {
      labelSpan.textContent = isDark ? 'Dark' : 'Light';
    }
  }

  /**
   * Toggle between light and dark themes upon user interaction.
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const nextTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(nextTheme, true);
  }

  /**
   * Initialize theme settings and event listeners when DOM is loaded.
   */
  function initTheme() {
    const activeTheme = getPreferredTheme();
    applyTheme(activeTheme, false);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }

    // Sync with OS preference changes if user hasn't explicitly set a preference
    mediaQuery.addEventListener('change', (e) => {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (!storedTheme) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT, false);
      }
    });
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
