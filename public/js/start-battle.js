document.addEventListener('DOMContentLoaded', () => {

    // User Pokémon Animation
    gsap.to('.user-pokemon-card img', {
        y: 4,  
        scale: 1.05,  
        yoyo: true,  
        repeat: -1,  
        duration: 0.9,  
        ease: "power1.inOut",  
    });

    // Opponent Pokémon Animation
    gsap.to('.opponent-pokemon-card img', {
        y: 5,  
        scale: 1.05,  
        yoyo: true,  
        repeat: -1, 
        duration: 0.7,  
        ease: "power1.inOut",  
    });
});