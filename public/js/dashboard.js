document.addEventListener('DOMContentLoaded', () => {
    // Select all the Pokémon images inside the Pokémon storage
    const pokemonImages = document.querySelectorAll('.pokemon-card img');

    // Loop through each image and add animation using GSAP
    pokemonImages.forEach((img) => {
        let hoverAnimation;

        img.addEventListener('mouseover', () => {
            hoverAnimation = gsap.to(img, { y: -10, duration: 0.6, ease: "power1.inOut", repeat: -1, yoyo: true });
        });

        img.addEventListener('mouseout', () => {
            hoverAnimation.kill();
            gsap.to(img, { y: 0, duration: 0.6, ease: "power1.inOut" });
        });
    });
});