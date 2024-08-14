
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/backpack');
    const backpackItems = await response.json();
    const backpackContainer = document.getElementById('backpack-items');

    if (!Array.isArray(backpackItems)) {
      throw new Error('Expected an array but received something else');
    }

    backpackContainer.innerHTML ='';

    backpackItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('backpack-item');

      const itemImage = document.createElement('img');
      itemImage.src = item.image;
      itemImage.alt = item.name;

      const itemName = document.createElement('h2');
      itemName.textContent = item.name;

      const itemCount = document.createElement('p');
      itemCount.textContent = `Owned: ${item.count}`;

      const useButton = document.createElement('button');
      useButton.textContent = 'Use';
      useButton.classList.add('use-button');
      useButton.addEventListener('click', async () => {

        // Fetch users Pokemon and show them
        const pokemonData = await fetch(`/api/pokemon/team`);
        const pokemons = await pokemonData.json();
        const pokemonContainer = document.getElementById('pokemon-container');
        // Clear modal 
        pokemonContainer.innerHTML = " ";
        // Declare modal
        const modal = document.querySelector('.pokemon-modal');
        // const errorModal = document.querySelector('.error-modal');
        const closeButton = document.querySelector('.close-button');
        // Function to open pokemon selection modal
        function openModal(pokemon) {
          pokemonContainer.appendChild(pokemon);
          modal.style.display = 'block';
        }
        // Function to close the modal
        closeButton.addEventListener('click', () => {
          modal.style.display = 'none';
        });
        // Close the modal when clicking outside of the modal content
        window.addEventListener('click', (event) => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
        // Renders each pokemon
        pokemons.forEach(pokemon => {
          const pokemonDiv = document.createElement('div');
          pokemonDiv.classList.add('backpack-item');
          const pokemonName = document.createElement('button');
          pokemonName.classList.add('use-button');
          pokemonName.textContent = `${pokemon.name} ${pokemon.pokemon_stat.current_hp} / ${pokemon.pokemon_stat.max_hp}`;
          pokemonName.value = pokemon.name;
          openModal(pokemonName);
          pokemonName.addEventListener('click', async (event) => {
            const selectedPokemon = event.target.value;
            console.log("Selected:" + " " + selectedPokemon)
            modal.style.display = 'none';
            // Send info of pokemon in body
            const useOnPokemonResponse = await fetch(`api/pokemon/item`, {
              method: 'POST',
              body: JSON.stringify({ effect_type: item.effect_type, effect_amount: item.effect_amount, item_id: item.id, id: pokemon.id }),
              headers: { 'Content-Type': 'application/json' }
            });
            const useOnPokemon = await useOnPokemonResponse.json();
            if (useOnPokemon.status) {
              // Change item count 
              if (useOnPokemon.item.count > 1) {
                itemCount.textContent = `Owned: ${useOnPokemon.item.count - 1}`;
              }
              else {
                backpackContainer.removeChild(itemDiv);
              }
            } else {
              alert(`Error: ${useOnPokemon.message}`)
            }
          });
        });
      });

      // Quantity dropdown for deletion
      const quantityLabel = document.createElement('label');
      quantityLabel.textContent = 'Delete Amount:';
      quantityLabel.classList.add('quantity-label');

      const quantitySelect = document.createElement('select');
      quantitySelect.classList.add('quantity-select');
      for (let i = 1; i <= item.count; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        quantitySelect.appendChild(option);
      }

      // Delete button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Sell';
      deleteButton.classList.add('delete-button');
      deleteButton.addEventListener('click', async () => {
        const quantityToDelete = parseInt(quantitySelect.value, 10);

        const deleteResponse = await fetch(`/api/backpack/delete/${item.id}`, {
          method: 'DELETE',
          body: JSON.stringify({ quantity: quantityToDelete }),
          headers: { 'Content-Type': 'application/json' },
        });

        if (deleteResponse.ok) {
          item.count -= quantityToDelete;
          if (item.count <= 0) {
            backpackContainer.removeChild(itemDiv);
          } else {
            itemCount.textContent = `Quantity: ${item.count}`;
          }
        } else {
          alert('Failed to delete item.');
        }
      });

      itemDiv.appendChild(itemImage);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemCount);
      itemDiv.appendChild(useButton);
      itemDiv.appendChild(quantityLabel);
      itemDiv.appendChild(quantitySelect);
      itemDiv.appendChild(deleteButton);

      backpackContainer.appendChild(itemDiv);
    });
  } catch (error) {
    console.error('Error fetching backpack items:', error);
  }
});