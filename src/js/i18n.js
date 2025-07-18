let currentLang = localStorage.getItem('lang') || 'en';
let translations = {};

function t(key, vars) {
  let str = translations[key] || key;
  if (vars) {
    for (const k in vars) {
      str = str.replace(`{${k}}`, vars[k]);
    }
  }
  return str;
}

async function loadLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  translations = await fetch(`lang/${lang}.json`).then(r => r.json());
  document.documentElement.lang = lang;
  applyTranslations();
  if (typeof updateTranslations === 'function') updateTranslations();
  if (typeof render === 'function') render();
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (translations[key]) el.textContent = t(key);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[key]) el.placeholder = t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    if (translations[key]) el.title = t(key);
  });
  if (typeof updateTitle === 'function') updateTitle();
}

document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('languageSelect');
  if (sel) {
    sel.addEventListener('change', e => loadLang(e.target.value));
    sel.value = currentLang;
  }
  loadLang(currentLang);
});

window.setLanguage = loadLang;
window.t = t;
