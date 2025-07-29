let siteData = { pictos: [], weapons: {}, outfits: [] };

async function loadSiteData() {
  if(window.keycloak?.authenticated){
    const api = window.CONFIG?.["clairobscur-api-url"] || '';
    if(api){
      try{
        const r = await apiFetch(`${api}/user/saved-data`);
        if(r.ok){
          const obj = await r.json();
          if(obj && typeof obj === 'object'){
            siteData = { pictos: [], weapons: {}, outfits: [], ...obj };
            return notifyPages();
          }
        }
      }catch(err){ console.error('load saved data failed', err); }
    }
  }
  const saved = localStorage.getItem('siteData');
  if(saved){
    try{ siteData = JSON.parse(saved); }
    catch(e){ siteData = { pictos: [], weapons: {}, outfits: [] }; }
  }
  notifyPages();
}

function getSavedItems(key, charId) {
  if(key === 'weapons' && charId !== undefined) {
    const data = siteData.weapons;
    if(Array.isArray(data)) return data;
    const arr = data?.[charId];
    return Array.isArray(arr) ? arr : [];
  }
  const arr = siteData[key];
  return Array.isArray(arr) ? arr : [];
}

function setSavedItems(key, arr, charId) {
  if(key === 'weapons' && charId !== undefined) {
    if(Array.isArray(siteData.weapons)) {
      siteData.weapons = { [charId]: siteData.weapons };
    }
    if(typeof siteData.weapons !== 'object' || siteData.weapons === null) {
      siteData.weapons = {};
    }
    siteData.weapons[charId] = Array.from(new Set(arr));
  } else {
    siteData[key] = Array.from(new Set(arr));
  }
  saveSiteData();
}

async function saveSiteData() {
  if(window.keycloak?.authenticated){
    const api = window.CONFIG?.["clairobscur-api-url"] || '';
    if(api){
      try{
        await apiFetch(`${api}/user/saved-data`,{method:'POST',body:siteData});
        return;
      }catch(err){ console.error('save data failed', err); }
    }
  }
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
      localStorage.clear();
      siteData = { pictos: [], weapons: {}, outfits: [] };
      if(Array.isArray(obj)) {
        siteData.pictos = obj;
      } else if(obj && typeof obj === 'object') {
        if(Array.isArray(obj.pictos)) siteData.pictos = obj.pictos;
        if(Array.isArray(obj.weapons) || typeof obj.weapons === 'object') siteData.weapons = obj.weapons;
        if(Array.isArray(obj.outfits)) siteData.outfits = obj.outfits;
      }
      saveSiteData();
      notifyPages();
    } catch(err) {
      /* ignore */
    }
  };
  reader.readAsText(file);
}

function notifyPages(){
  const page = document.body.dataset.page;
  if(page==='pictos' && window.pictosPage?.onSiteDataUpdated){
    window.pictosPage.onSiteDataUpdated();
  } else if(page==='weapons' && window.weaponsPage?.onSiteDataUpdated){
    window.weaponsPage.onSiteDataUpdated();
  } else if(page==='outfits' && window.outfitsPage?.onSiteDataUpdated){
    window.outfitsPage.onSiteDataUpdated();
  } else if(typeof onSiteDataUpdated === 'function'){
    onSiteDataUpdated();
  }
}

document.addEventListener('DOMContentLoaded', loadSiteData);
window.addEventListener('beforeunload', saveSiteData);

window.getSavedItems = getSavedItems;
window.setSavedItems = setSavedItems;
window.saveSiteData = saveSiteData;
window.downloadSiteData = downloadSiteData;
window.handleSiteUpload = handleSiteUpload;
window.loadSiteData = loadSiteData;
