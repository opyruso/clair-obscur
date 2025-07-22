let keycloak = null;
let refreshTimer = null;

function startTokenRefresh(){
  if(refreshTimer || !keycloak) return;
  refreshTimer = setInterval(()=>{
    keycloak.updateToken(60).catch(err=>{
      console.error('Token refresh failed', err);
      stopTokenRefresh();
    });
  }, 30000);
}

function stopTokenRefresh(){
  if(refreshTimer){
    clearInterval(refreshTimer);
    refreshTimer=null;
  }
}

function updateLoginState(authenticated){
  const btn=document.getElementById('loginBtn');
  if(!btn) return;

  if(authenticated){
    startTokenRefresh();
    const username=keycloak?.tokenParsed?.preferred_username||'user';
    btn.classList.add('user-name');
    btn.textContent=username;
    const adminLink=document.getElementById('adminNav');
    const existing=btn.querySelector('.admin-crown');
    if(existing) existing.remove();
    if(keycloak.hasResourceRole?.('admin','coh-app')){
      const icon=document.createElement('i');
      icon.className='fa-solid fa-crown admin-crown';
      btn.appendChild(icon);
      if(adminLink) adminLink.style.display='block';
    }else{
      if(adminLink) adminLink.style.display='none';
    }
    btn.dataset.i18nTitle='logout';
    btn.title=t('logout');
    btn.onclick=()=>keycloak.logout();
  }else{
    stopTokenRefresh();
    const adminLink=document.getElementById('adminNav');
    if(adminLink) adminLink.style.display='none';
    btn.classList.remove('user-name');
    btn.innerHTML='<i class="fa-solid fa-user"></i>';
    btn.dataset.i18nTitle='login';
    btn.title=t('login');
    btn.onclick=()=>keycloak.login();
  }
}

function initAuth(){
  if(!window.CONFIG) return;
  const {"auth-url":url,"auth-realm":realm,"auth-client-id":clientId}=window.CONFIG;
  if(!url||!realm||!clientId) return;
  keycloak = new window.Keycloak({url,realm,clientId});
  window.keycloak = keycloak;
  const base = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
  const silentUri = `${base}/silent-check-sso.html`;
  keycloak.onAuthSuccess=()=>updateLoginState(true);
  keycloak.onAuthLogout=()=>updateLoginState(false);

  keycloak.init({
    onLoad:'check-sso',
    checkLoginIframe:false,
    silentCheckSsoRedirectUri:silentUri,
    pkceMethod:'S256'
  })
    .then(auth=>updateLoginState(auth))
    .catch(err=>{
      const message = err?.error
        ? `${err.error}: ${err.error_description || ''}`
        : err?.message || err || 'unknown';
      console.error('Keycloak init error', message);
      updateLoginState(keycloak?.authenticated);
    });
}

document.addEventListener('DOMContentLoaded',initAuth);

async function apiFetch(url, options = {}) {
  if (window.keycloak) {
    try {
      await window.keycloak.updateToken(30);
    } catch (e) {
      console.error('Token refresh failed before fetch', e);
    }
  }
  const headers = Object.assign({}, options.headers);
  const token = window.keycloak?.token;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  let { body } = options;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    if (!headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    body = JSON.stringify(body);
  }
  return fetch(url, { ...options, headers, body });
}

window.apiFetch = apiFetch;

