const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const name = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    const confirmPassword = document.querySelector('#confirm-password-signup').value.trim();
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
  
    if (name && email && password.length >= 8) {
      const response = await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to sign up.');
      }
    } else {
      alert('Password must be at least 8 characters long');
    }
  };
  
  document.querySelector('.signup-form').addEventListener('submit', signupFormHandler);