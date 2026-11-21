(function () {
  'use strict';

  const STORAGE_KEY = 'theme';
  const THEME_DARK = 'dark';
  const THEME_LIGHT = 'light';
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Read saved theme or fallback to system preference
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === THEME_DARK || stored === THEME_LIGHT) return stored;
    return mediaQuery.matches ? THEME_DARK : THEME_LIGHT;
  }

  // Apply theme to document root and sync button
  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    if (persist) localStorage.setItem(STORAGE_KEY, theme);
    syncToggleButton(theme);
  }

  // Update button text, icon, and aria attributes
  function syncToggleButton(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const iconSpan = btn.querySelector('.theme-icon');
    const labelSpan = btn.querySelector('.theme-label');
    const isDark = theme === THEME_DARK;

    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    if (iconSpan) iconSpan.textContent = isDark ? '🌙' : '☀️';
    if (labelSpan) labelSpan.textContent = isDark ? 'Dark' : 'Light';
  }

  // Toggle current theme
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next, true);
  }

  // Initialize theme controls and event listeners
  function initTheme() {
    applyTheme(getPreferredTheme(), false);

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', toggleTheme);

    mediaQuery.addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? THEME_DARK : THEME_LIGHT, false);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
})();
