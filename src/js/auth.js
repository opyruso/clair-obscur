(() => {
  let pollId = null;

  function handleLoginClick() {
    const isLogged = !!localStorage.getItem('accessToken');
    if (isLogged) {
      localStorage.removeItem('accessToken');
    } else {
      localStorage.setItem('accessToken', 'placeholder');
    }
    updateLoginState();
  }

  function updateLoginState() {
    const btn = document.getElementById('loginBtn');
    if (!btn) {
      // Wait for the button to be inserted before modifying it.
      // Short 50ms polling avoids heavy load while staying responsive.
      if (!pollId) pollId = setInterval(updateLoginState, 50);
      return;
    }
    if (pollId) {
      clearInterval(pollId);
      pollId = null;
      btn.addEventListener('click', handleLoginClick);
    }
    const isLogged = !!localStorage.getItem('accessToken');
    btn.textContent = isLogged ? 'Logout' : 'Login';
    btn.classList.toggle('logged', isLogged);
  }

  document.addEventListener('DOMContentLoaded', updateLoginState);

  window.updateLoginState = updateLoginState;
})();
