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
  updateFlagState();
  const pageObj = window[document.body.dataset.page + 'Page'];
  if(pageObj){
    if(typeof pageObj.updateTranslations === 'function') pageObj.updateTranslations();
    if(typeof pageObj.loadData === 'function') pageObj.loadData();
    if(typeof pageObj.render === 'function') pageObj.render();
  }
  window.dispatchEvent(new CustomEvent('langchange', {detail: lang}));
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

function updateFlagState() {
  document.querySelectorAll('.lang-flag').forEach(el => {
    el.classList.toggle('active', el.dataset.lang === currentLang);
  });
}

function bindLangEvents() {
  document.querySelectorAll('.lang-flag').forEach(el => {
    el.removeEventListener('click', langClickHandler);
    el.addEventListener('click', langClickHandler);
  });
}

function langClickHandler(event) {
  loadLang(event.currentTarget.dataset.lang);
}

document.addEventListener('DOMContentLoaded', () => {
  bindLangEvents();
  loadLang(currentLang);
});

window.bindLangEvents = bindLangEvents;

window.setLanguage = loadLang;
window.t = t;
