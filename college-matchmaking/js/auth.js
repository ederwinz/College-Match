/**
 * Auth logic — sign up, log in, .edu email check
 */

const form = document.getElementById('auth-form');
const titleEl = document.getElementById('auth-title');
const submitBtn = document.getElementById('auth-submit');
const messageEl = document.getElementById('auth-message');
const toggleLink = document.getElementById('toggle-mode');

let isLoginMode = false;

// Check if email ends with .edu
function isValidCollegeEmail(email) {
  return email.toLowerCase().endsWith('.edu');
}

function showMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = 'auth-message ' + type;
}

function setMode(login) {
  isLoginMode = login;
  titleEl.textContent = login ? 'Log in' : 'Sign up';
  submitBtn.textContent = login ? 'Log in' : 'Sign up';
  toggleLink.textContent = login ? 'Sign up' : 'Log in';
  showMessage('');
}

// Toggle between login and signup
toggleLink.addEventListener('click', (e) => {
  e.preventDefault();
  setMode(!isLoginMode);
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  showMessage('');

  // College verification: only .edu emails
  if (!isValidCollegeEmail(email)) {
    showMessage('Please use a .edu email address.', 'error');
    return;
  }

  try {
    if (isLoginMode) {
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error) throw error;
      showMessage('Redirecting...', 'success');
      window.location.href = 'profile.html';
    } else {
      const { error } = await db.auth.signUp({ email, password });
      if (error) throw error;
      showMessage('Check your email to confirm your account, then log in.', 'success');
    }
  } catch (err) {
    showMessage(err.message || 'Something went wrong. Try again.', 'error');
  }
});
