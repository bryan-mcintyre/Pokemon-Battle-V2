document.querySelectorAll('.choose-starter-button').forEach(button => {
    button.addEventListener('click', async (event) => {
      const pokemonID = event.target.getAttribute('data-id');
  
      try {
        const response = await fetch('/api/starters/choose-starter', {
          method: 'POST',
          body: JSON.stringify({ pokemonID }),
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
        console.error('Error choosing starter:', error);
        alert('Failed to choose starter due to a network error.');
      }
    });
  
    // GSAP animation for the dancing effect on hover
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      duration: 0.2,
      rotation: 3,      
      y: 0,             
      scale: 1.5,        
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 5          // Repeat the animation a few times to simulate dancing
    });
  });

  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      duration: 0.5,
      rotation: 0,       // Return to original rotation
      y: 0,              // Return to original position
      scale: 1,          // Return to original size
      ease: 'elastic.out(1, 0.3)'
    });
  });
});