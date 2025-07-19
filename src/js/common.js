async function loadCommon() {
  ReactDOM.createRoot(document.getElementById('header')).render(React.createElement(Header));
  ReactDOM.createRoot(document.getElementById('footer')).render(React.createElement(Footer));
  document.getElementById('year').textContent = new Date().getFullYear();
  if(typeof bindLangEvents==='function') bindLangEvents();
  const page = document.body.dataset.page;
  const active = document.querySelector(`a[data-page="${page}"]`);
  if(active) active.classList.add('active');
  if(typeof applyTranslations==='function') applyTranslations();
  if(typeof updateFlagState==='function') updateFlagState();
  document.dispatchEvent(new Event('commonLoaded'));
}

document.addEventListener('DOMContentLoaded', loadCommon);
