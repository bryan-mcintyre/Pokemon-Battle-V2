document.addEventListener('DOMContentLoaded', () => {
    const yesButton = document.getElementById('yes-button');
    const noButton = document.getElementById('no-button');
    const pokemonStorage = document.getElementById('pokemon-storage');
    const battleModal = document.getElementById('battle-modal');
    const battleModalOkButton = document.getElementById('battle-modal-ok-button');

    // Handle the No button click
    noButton.addEventListener('click', () => {
        window.location.href = '/dashboard';
    });

    // Handle the Yes button click
    yesButton.addEventListener('click', () => {
        pokemonStorage.style.display = 'block';
        battleModal.style.display = 'block';
    });

    // Handle modal Okay button click
    battleModalOkButton.addEventListener('click', () => {
        battleModal.style.display = 'none';
    });

    // Handle Pokémon selection
    const selectButtons = document.querySelectorAll('.select-button');
    selectButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const pokemonCard = event.target.closest('.pokemon-card');
            const pokemonId = pokemonCard.dataset.id;

            // Grab opponent Pokémon data from a hidden field or the existing data in the DOM
            const opponentPokemon = JSON.parse(document.getElementById('opponent-pokemon-data').value);

            // Save selected Pokémon and redirect to start-battle
            const response = await fetch('/battle/startBattle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pokemon_id: pokemonId,
                    opponent_pokemon: opponentPokemon,
                }),
            });

            console.log(response);

            if (response.ok) {
                window.location.href = '/battle/startBattle';
            } else {
                alert('Failed to start the battle. Please try again.');
            }
        });
    });
});

