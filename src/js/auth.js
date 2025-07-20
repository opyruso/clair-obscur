let keycloak = null;

function updateLoginState(authenticated){
  const btn=document.getElementById('loginBtn');
  if(!btn) return;
  if(authenticated){
    btn.innerHTML='<i class="fa-solid fa-right-from-bracket"></i>';
    btn.dataset.i18nTitle='logout';
    btn.title=t('logout');
    btn.onclick=()=>keycloak.logout();
  }else{
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
  const silentUri = `${window.location.origin}/silent-check-sso.html`;
  keycloak.init({
    onLoad:'check-sso',
    checkLoginIframe:false,
    silentCheckSsoRedirectUri:silentUri,
    pkceMethod:'S256'
  })
    .then(auth=>updateLoginState(auth))
    .catch(()=>updateLoginState(false));
}

document.addEventListener('DOMContentLoaded',initAuth);

