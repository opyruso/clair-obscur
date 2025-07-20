(() => {
  let pollId = null;

  function updateLoginState() {
    const btn = document.getElementById('loginBtn');
    if (!btn) {
      // Wait for the button to be inserted before modifying it
      if (!pollId) pollId = setInterval(updateLoginState, 50); // small delay
      return;
    }
    if (pollId) {
      clearInterval(pollId);
      pollId = null;
    }
    const isLogged = !!localStorage.getItem('accessToken');
    btn.textContent = isLogged ? 'Logout' : 'Login';
    btn.classList.toggle('logged', isLogged);
  }

  document.addEventListener('DOMContentLoaded', updateLoginState);

  window.updateLoginState = updateLoginState;
})();
