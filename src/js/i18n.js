let currentLang = localStorage.getItem('lang') || 'en';
let translations = {};
let gameTranslations = {};
let enTranslations = {};
let enGameTranslations = {};
let showLabels = localStorage.getItem('showLabels') === '1';

function t(key, vars) {
  let str = translations[key];
  if(str === undefined) str = gameTranslations[key];
  if(str === undefined) str = enTranslations[key];
  if(str === undefined) str = enGameTranslations[key];
  if(str === undefined) str = key;
  if (vars) {
    for (const k in vars) {
      str = str.replace(`{${k}}`, vars[k]);
    }
  }
  return showLabels ? key : str;
}

function tg(key, label, vars){
  let str = gameTranslations[key];
  if(str === undefined) str = translations[key];
  if(str === undefined) str = enGameTranslations[key];
  if(str === undefined) str = enTranslations[key];
  if(str === undefined) str = label !== undefined ? label : key;
  if (vars) {
    for (const k in vars) {
      str = str.replace(`{${k}}`, vars[k]);
    }
  }
  return showLabels ? key : formatGameString(str);
}

function formatGameString(str){
  return str
    .replace(/<br\s*\/?\s*>/gi, '<br/>')
    .replace(/<span class='([^']+)'>([^<]*)<\/span>/gi, (m, cls, txt) => {
      return `<span class="game-span"><img src="resources/images/icons/game/${cls}.webp" class="game-icon" alt=""/>${txt}</span>`;
    })
    .replace(/<img id='([^']+)'\s*\/>/gi, (m, id) => {
      return `<img src="resources/images/icons/game/${id}.webp" class="game-img" alt=""/>`;
    });
}

async function loadLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  translations = await fetch(`lang/${lang}.json`).then(r => r.json());
  try {
    gameTranslations = await fetch(`lang/gamedata_${lang}.json`).then(r => r.json());
  } catch (e) {
    gameTranslations = {};
  }
  if(!Object.keys(enTranslations).length){
    try { enTranslations = await fetch('lang/en.json').then(r => r.json()); } catch(e){ enTranslations = {}; }
    try { enGameTranslations = await fetch('lang/gamedata_en.json').then(r => r.json()); } catch(e){ enGameTranslations = {}; }
  }
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
    const src = translations[key] !== undefined ? 'normal'
      : (gameTranslations[key] !== undefined ? 'game' : 'normal');
    if(showLabels){
      el.innerHTML = `<span class="label-debug ${src}">${key}</span>`;
    }else if (translations[key] || gameTranslations[key]){
      const str = t(key);
      el.innerHTML = src === 'game' ? formatGameString(str) : str;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    if (translations[key]) el.placeholder = showLabels ? key : t(key);
  });
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.dataset.i18nTitle;
    if (translations[key]) el.title = showLabels ? key : t(key);
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

function setShowLabels(flag){
  showLabels = flag;
  localStorage.setItem('showLabels', flag ? '1' : '0');
  applyTranslations();
  const pageObj = window[document.body.dataset.page + 'Page'];
  if(pageObj){
    if(typeof pageObj.updateTranslations === 'function') pageObj.updateTranslations();
    if(typeof pageObj.render === 'function') pageObj.render();
  }
}

function bindShowLabelsToggle(){
  const chk=document.getElementById('labelToggleInput');
  if(!chk) return;
  chk.checked = showLabels;
  chk.onchange=()=>setShowLabels(chk.checked);
}

function langClickHandler(event) {
  loadLang(event.currentTarget.dataset.lang);
}

document.addEventListener('DOMContentLoaded', () => {
  bindLangEvents();
  loadLang(currentLang);
  bindShowLabelsToggle();
});

window.bindLangEvents = bindLangEvents;

window.setLanguage = loadLang;
window.t = t;
window.tg = tg;
window.setShowLabels = setShowLabels;
window.bindShowLabelsToggle = bindShowLabelsToggle;
window.formatGameString = formatGameString;
