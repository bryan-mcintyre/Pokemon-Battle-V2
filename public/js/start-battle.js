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

    const startBattleButton = document.getElementById('start-battle-button');
    const userPokemonCard = document.querySelector('.user-pokemon-card');
    const attackButton = document.createElement('button');
    const quitBattleButton = document.getElementById('quit-battle-button');

    attackButton.textContent = "Attack!";
    attackButton.className = 'attack-button';
    userPokemonCard.appendChild(attackButton);

    quitBattleButton.addEventListener('click', () => {
        window.location.href = '/dashboard';
    });

    gsap.to(quitBattleButton, {
        scale: 1.1,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "power1.inOut"
    })

    // GSAP Pulse Animation for Start Battle Button
    gsap.to(startBattleButton, {
        scale: 1.1,
        yoyo: true,
        repeat: -1,
        duration: 1,
        ease: "power1.inOut"
    });

    startBattleButton.addEventListener('click', () => {
        gsap.to(startBattleButton, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                startBattleButton.style.display = 'none';
                attackButton.style.display = 'block';
                gsap.fromTo(attackButton, { opacity: 0 }, { opacity: 1, duration: 0.5 });
            }
        });
    });

    // Hover animation for the Attack button using GSAP
    attackButton.addEventListener('mouseenter', () => {
        gsap.to(attackButton, {
            scale: 1.5,
            duration: 0.5,
            ease: "power1.inOut"
        });
    });

    attackButton.addEventListener('mouseleave', () => {
        gsap.to(attackButton, {
            scale: 1,
            duration: 0.5,
            ease: "power1.inOut"
        });
    });

    attackButton.addEventListener('click', () => {
        fetch('/api/battleRoutes/user/attack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === "You win!") {
                    alert('You win!');
                } else {
                    alert('Waiting for opponent\'s move...');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});