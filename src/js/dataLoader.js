let dataCache = null;
let dataLang = null;

async function fetchSiteData(lang = currentLang) {
  if (dataCache && dataLang === lang) {
    return dataCache;
  }
  const api = window.CONFIG?.["clairobscur-api-url"] || '';
  const data = await apiFetch(`${api}/public/data/${lang}`).then(r => r.json());
  dataCache = data;
  dataLang = lang;
  return data;
}

function preloadSiteData() {
  fetchSiteData().catch(() => {});
}

document.addEventListener('DOMContentLoaded', preloadSiteData);

window.getSiteData = fetchSiteData;
