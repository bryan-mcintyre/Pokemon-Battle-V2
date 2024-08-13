document.addEventListener('DOMContentLoaded', () => {

    // User Pokémon Animation
    gsap.to('.user-main-pokemon-img', {
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
    function userAttackAnimation(onComplete) {
        gsap.to('.user-main-pokemon-img', {
            zIndex: 10,
            x: 1380,
            duration: 0.5,
            onComplete: () => {
                gsap.to('.opponent-pokemon-card img', {
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to('.user-main-pokemon-img', { x: 0, duration: 0.5 });
                        gsap.set('.user-main-pokemon-img', { zIndex: 1 });
                        if (typeof onComplete === "function") {
                            onComplete();
                        }
                    }
                });
            }
        });
    }

    // Attack animation for the opponent's Pokémon
    function opponentAttackAnimation(onComplete) {
        gsap.to('.opponent-pokemon-card img', {
            zIndex: 10,
            x: -1380,
            duration: 0.5,
            onComplete: () => {
                gsap.to('.user-main-pokemon-img', {
                    opacity: 0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1,
                    onComplete: () => {
                        gsap.to('.opponent-pokemon-card img', { x: 0, duration: 0.5 });
                        gsap.set('.opponent-pokemon-card img', { zIndex: 1 });
                        if (typeof onComplete === "function") {
                            onComplete();
                        }
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
        attackButton.disabled = true;


        fetch('/api/battle/user/attack', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                if (data.attackOpponent) {
                    userAttackAnimation();
                    updateUI(data.userPokemon.current_hp, data.opponentPokemon.current_hp);
                }
                if (!data.opponentPokemon.alive || data.opponentPokemon.current_hp <= 0) {
                    if (data.message === "You win!") {
                        showYouWinModal();
                    } else {
                        showEnemyDeadModal();
                    }
                    return;
                }

                if (!data.userPokemon.alive || data.userPokemon.current_hp <= 0) {
                    showUserPokemonDeadModal();
                    return;
                }

                showWaitingOpponentModal();
                setTimeout(() => {
                    opponentAttackAnimation();
                    fetch('/api/battle/opponent/attack', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                    })
                        .then(response => response.json())
                        .then(opponentData => {
                            opponentData.userPokemon.current_hp = Math.round(opponentData.userPokemon.current_hp);
                            opponentData.opponentPokemon.current_hp = Math.round(opponentData.opponentPokemon.current_hp);

                            // Update UI after opponent's attack
                            updateUI(opponentData.userPokemon.current_hp, opponentData.opponentPokemon.current_hp);

                            if (opponentData.message === "You lost!") {
                                showYouLoseModal();
                            } else {
                                attackButton.disabled = false;
                                showYourMoveModal();
                            }
                        })
                        .catch(error => {
                            console.error('Error during opponent\'s attack:', error);
                        });
                }, 2500); // 3-second timer
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    function showWaitingOpponentModal(onComplete) {
        const modal = document.createElement('div');
        modal.className = 'waiting-opponent-modal';
        modal.innerHTML = `<h2>Waiting for opponent's move...</h2>`;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'block', opacity: 1, duration: 0.5 });

        setTimeout(() => {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.body.removeChild(modal);
                    if (typeof onComplete === "function") {
                        onComplete();
                    }
                }
            });
        }, 2000); // Auto-close after 2 seconds
    }

    function showYourMoveModal() {
        const modal = document.createElement('div');
        modal.className = 'your-move-modal';
        modal.innerHTML = `<h2>Your move!</h2>`;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'block', opacity: 1, duration: 0.5 });

        setTimeout(() => {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.body.removeChild(modal);
                }
            });
        }, 2000); // Auto-close after 2 seconds
    }

    function showYouLoseModal() {
        const modal = document.createElement('div');
        modal.className = 'you-lose-modal';
        modal.innerHTML = `
            <div class="you-lose-modal-content">
                <h2>You Lose!</h2>
                <div class="you-lose-modal-buttons">
                    <button id="go-to-dashboard">Go to Dashboard</button>
                    <button id="try-again">Try again?</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'flex', opacity: 1, duration: 0.5 });

        document.getElementById('go-to-dashboard').addEventListener('click', () => {
            window.location.href = '/dashboard';
        });

        document.getElementById('try-again').addEventListener('click', () => {
            window.location.href = '/battle';
        });
    }

    function showYouWinModal() {
        const modal = document.createElement('div');
        modal.className = 'you-win-modal';
        modal.innerHTML = `
            <div class="you-win-modal-content">
                <h2>You Win!</h2>
                <div class="you-win-modal-buttons">
                    <button id="go-to-dashboard">Go to Dashboard</button>
                    <button id="try-again">Battle again?</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'flex', opacity: 1, duration: 0.5 });

        document.getElementById('go-to-dashboard').addEventListener('click', () => {
            window.location.href = '/dashboard';
        });

        document.getElementById('try-again').addEventListener('click', () => {
            window.location.href = '/battle';
        });
    }

    function showEnemyDeadModal() {
        const modal = document.createElement('div');
        modal.className = 'enemy-dead-modal';
        modal.innerHTML = `<h2>Enemy Pokémon is dead</h2>`;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'block', opacity: 1, duration: 0.5 });

        setTimeout(() => {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.body.removeChild(modal);
                }
            });
        }, 2000); // Auto-close after 2 seconds
    }

    function showUserPokemonDeadModal() {
        const modal = document.createElement('div');
        modal.className = 'user-pokemon-dead-modal';
        modal.innerHTML = `<h2>Your Pokémon is dead</h2>`;

        document.body.appendChild(modal);

        gsap.to(modal, { display: 'block', opacity: 1, duration: 0.5 });

        setTimeout(() => {
            gsap.to(modal, {
                opacity: 0,
                duration: 0.5,
                onComplete: () => {
                    document.body.removeChild(modal);
                }
            });
        }, 2000); // Auto-close after 2 seconds
    }

    // update ui hp
    function updateUI(userPokemonHP, opponentPokemonHP) {
        userPokemonHP = Math.round(userPokemonHP);
        opponentPokemonHP = Math.round(opponentPokemonHP);
        // Update HP for user's Pokemon
        const userPokemonHPElement = document.querySelector('.user-pokemon-card .pokemon-stat p');
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
