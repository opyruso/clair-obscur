let dataCache = null;
let dataLang = null;
let dataPromise = null;

async function fetchSiteData(lang = currentLang) {
  if (dataCache && dataLang === lang) {
    window.siteData = dataCache;
    return dataCache;
  }
  if (dataPromise && dataLang === lang) {
    return dataPromise;
  }
  dataLang = lang;
  const api = window.CONFIG?.["clairobscur-api-url"] || '';
  dataPromise = apiFetch(`${api}/public/data/${lang}`)
    .then(r => r.json())
    .then(data => {
      dataCache = data;
      window.siteData = data;
      dataPromise = null;
      return data;
    })
    .catch(err => {
      dataPromise = null;
      throw err;
    });
  return dataPromise;
}

function preloadSiteData() {
  fetchSiteData().catch(() => {});
}

document.addEventListener('DOMContentLoaded', preloadSiteData);

window.getSiteData = fetchSiteData;
