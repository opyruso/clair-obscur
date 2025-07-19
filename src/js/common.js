async function loadCommon() {
  ReactDOM.createRoot(document.getElementById('header')).render(
    React.createElement(Header)
  );
  ReactDOM.createRoot(document.getElementById('footer')).render(
    React.createElement(Footer)
  );
  if(typeof bindLangEvents==='function') bindLangEvents();
  const page = document.body.dataset.page;
  const active = document.querySelector(`a[data-page="${page}"]`);
  if(active) active.classList.add('active');
  if(typeof applyTranslations==='function') applyTranslations();
  if(typeof updateFlagState==='function') updateFlagState();
  // Defer event dispatch to ensure React DOM is mounted
  setTimeout(() => {
    document.dispatchEvent(new Event('commonLoaded'));
  }, 0);
}

// Wait for the full window load to ensure Babel compiled components are ready
window.addEventListener('load', loadCommon);
