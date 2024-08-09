document.querySelectorAll('.choose-starter-button').forEach(button => {
  button.addEventListener('click', async (event) => {
    const name = event.target.getAttribute('data-id');

    try {
      const response = await fetch('/api/starter/choose-starter', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        const errorMessage = await response.json();
        alert(`Failed to choose starter: ${errorMessage.message}`);
        console.error('Error response:', errorMessage);
      }
    } catch (error) {
      console.error('Error during choosing starter:', error);
      alert('Failed to choose starter due to a network error.');
    }
  });
});