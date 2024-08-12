document.addEventListener('DOMContentLoaded', () => {
    // Select all the Pokémon cards
    const pokemonCards = document.querySelectorAll('.pokemon-card');

    // Loop through each card and add animation using GSAP
    pokemonCards.forEach((card) => {
        let hoverAnimation;
        const img = card.querySelector('img'); 

        card.addEventListener('mouseover', () => {
            hoverAnimation = gsap.to(img, { y: -10, duration: 0.6, ease: "power1.inOut", repeat: -1, yoyo: true });
        });

        card.addEventListener('mouseout', () => {
            hoverAnimation.kill();
            gsap.to(img, { y: 0, duration: 0.6, ease: "power1.inOut" });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-storage');
    const storageContainer = document.querySelector('.bg-container');

    toggleButton.addEventListener('click', () => {
        storageContainer.classList.toggle('hidden');

        // Toggle button text
        if (storageContainer.classList.contains('hidden')) {
            toggleButton.textContent = 'Show Pokémon Storage';
        } else {
            toggleButton.textContent = 'Hide Pokémon Storage';
        }
    });
});