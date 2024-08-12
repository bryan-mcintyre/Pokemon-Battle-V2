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
    });

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

    // Attack animation for the user's Pokémon
    function userAttackAnimation() {
        gsap.to('.user-pokemon-card img', {
            x: 1380,
            duration: 0.5,
            onComplete: () => {
                gsap.to('.opponent-pokemon-card img', {
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to('.user-pokemon-card img', { x: 0, duration: 0.5 });
                    }
                });
            }
        });
    }

    // Attack animation for the opponent's Pokémon
    function opponentAttackAnimation() {
        gsap.to('.opponent-pokemon-card img', {
            x: -1380,
            duration: 0.5,
            onComplete: () => {
                gsap.to('.user-pokemon-card img', {
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to('.opponent-pokemon-card img', { x: 0, duration: 0.5 });
                    }
                });
            }
        });
    }

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



    // logic attack
    attackButton.addEventListener('click', () => {
        console.log("ASDAWDWADAWDAWDAW-----------------------")
        attackButton.disabled = true;
        fetch('/api/battle/user/attack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                const userTurn = data.userTurn;

                // If it's the user's turn, animate the user's Pokémon attack
                if (userTurn) {
                    userAttackAnimation();
                } else {
                    opponentAttackAnimation(); // If it's the opponent's turn, animate their attack
                }

                if (data.message === "You win!") {
                    alert('You win!');
                } else {
                    // update UI after attack user
                    console.log(data)
                    updateUI(data.userPokemon.current_hp, data.opponentPokemon.current_hp);

                    alert('Waiting for opponent\'s move...');

                    // start attack after 3 seconds
                    setTimeout(() => {
                        fetch('/api/battle/opponent/attack', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                        })
                            .then(response => response.json())
                            .then(opponentData => {
                                // update ui after attack
                                console.log(opponentData)

                                updateUI(opponentData.userPokemon.current_hp, opponentData.opponentPokemon.current_hp);

                                if (opponentData.message === "You lose!") {
                                    alert('You lose!');
                                } else {
                                    attackButton.disabled = false;
                                    alert('Your move!');
                                }
                            })
                            .catch(error => {
                                console.error('Error during opponent\'s attack:', error);
                            });
                    }, 3000); // 3 second timer
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    // update ui hp
    function updateUI(userPokemonHP, opponentPokemonHP) {
        // Update HP for user's Pokemon
        const userPokemonHPElement = document.querySelector('.user-pokemon-card p:first-of-type');
        userPokemonHPElement.textContent = userPokemonHPElement.textContent.replace(/(\d+) \//, `${userPokemonHP} /`);

        // Update HP for opponent's Pokemon
        const opponentPokemonHPElement = document.querySelector('.opponent-pokemon-card p:first-of-type');
        opponentPokemonHPElement.textContent = opponentPokemonHPElement.textContent.replace(/(\d+) \//, `${opponentPokemonHP} /`);
    }

    // Stat icons and modal logic
    const hpIcon = document.getElementById('hp-icon');
    const attackIcon = document.getElementById('attack-icon');
    const defenseIcon = document.getElementById('defense-icon');

    hpIcon.addEventListener('click', () => {
        showPokemonStatModal("HP Ability", "If your Pokémon has [HP Ability Name]. This gives it a boost to its HP!");
    });

    attackIcon.addEventListener('click', () => {
        showPokemonStatModal("Attack Ability", "If your Pokémon has [Attack Ability Name]. This gives it a boost to its Attack!");
    });

    defenseIcon.addEventListener('click', () => {
        showPokemonStatModal("Defense Ability", "If your Pokémon has [Defense Ability Name]. This gives it a boost to its Defense!");
    });

    // Function to show the modal
    function showPokemonStatModal(title, message) {
        const modal = document.createElement('div');
        modal.className = 'pokemon-stat-modal';
        modal.style.display = 'flex';

        modal.innerHTML = `
            <div class="pokemon-stat-modal-content">
                <h2>${title}</h2>
                <p>${message}</p>
                <button class="pokemon-stat-modal-close">&times;</button>
            </div>
        `;

        document.body.appendChild(modal);

        const closeModal = modal.querySelector('.pokemon-stat-modal-close');
        closeModal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
});
