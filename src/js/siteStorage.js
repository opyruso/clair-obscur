let siteData = { pictos: [], weapons: [] };

function loadSiteData() {
  const saved = localStorage.getItem('siteData');
  if(saved) {
    try { siteData = JSON.parse(saved); }
    catch(e) { siteData = { pictos: [], weapons: [] }; }
  }
}

function getSavedItems(key) {
  const arr = siteData[key];
  return Array.isArray(arr) ? arr : [];
}

function setSavedItems(key, arr) {
  siteData[key] = Array.from(new Set(arr));
  saveSiteData();
}

function saveSiteData() {
  localStorage.setItem('siteData', JSON.stringify(siteData));
}

function downloadSiteData() {
  const data = JSON.stringify(siteData, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'clairObscurData.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function handleSiteUpload(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const obj = JSON.parse(e.target.result);
      if(Array.isArray(obj)) {
        siteData.pictos = obj;
      } else if(obj && typeof obj === 'object') {
        if(Array.isArray(obj.pictos)) siteData.pictos = obj.pictos;
        if(Array.isArray(obj.weapons)) siteData.weapons = obj.weapons;
      }
      const page = document.body.dataset.page;
      if(page==='pictos' && window.pictosPage?.onSiteDataUpdated) {
        window.pictosPage.onSiteDataUpdated();
      } else if(page==='weapons' && window.weaponsPage?.onSiteDataUpdated) {
        window.weaponsPage.onSiteDataUpdated();
      } else if(typeof onSiteDataUpdated === 'function') {
        onSiteDataUpdated();
      }
    } catch(err) {
      /* ignore */
    }
  };
  reader.readAsText(file);
}

document.addEventListener('DOMContentLoaded', loadSiteData);
window.addEventListener('beforeunload', saveSiteData);

window.getSavedItems = getSavedItems;
window.setSavedItems = setSavedItems;
window.saveSiteData = saveSiteData;
window.downloadSiteData = downloadSiteData;
window.handleSiteUpload = handleSiteUpload;
