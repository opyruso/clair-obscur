async function loadCommon() {
  const [header, footer] = await Promise.all([
    fetch('header.html').then(r => r.text()),
    fetch('footer.html').then(r => r.text())
  ]);
  document.getElementById('header').outerHTML = header;
  document.getElementById('footer').outerHTML = footer;
  document.getElementById('year').textContent = new Date().getFullYear();
  if(typeof bindLangEvents==='function') bindLangEvents();
  const page = document.body.dataset.page;
  const active = document.querySelector(`a[data-page="${page}"]`);
  if(active) active.classList.add('active');
  if(typeof applyTranslations==='function') applyTranslations();
  if(typeof updateFlagState==='function') updateFlagState();
}

document.addEventListener('DOMContentLoaded', loadCommon);
