// const { PokemonStats } = require("../../models");

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/backpack');
    const backpackItems = await response.json();
    const backpackContainer = document.getElementById('backpack-items');

    // const modal = document.querySelector('.pokemon-modal');
    // const modalMessage = document.getElementById('pokemonMessage');
    // const closeButton = document.querySelector('.close-button');

    // // Function to open the modal
    // function openModal(message) {
    //     modalMessage.textContent = message;
    //     modal.style.display = 'block';
    // }

    // // Function to close the modal
    // closeButton.addEventListener('click', () => {
    //     modal.style.display = 'none';
    // });

    // Close the modal when clicking outside of the modal content
    // window.addEventListener('click', (event) => {
    //     if (event.target === modal) {
    //         modal.style.display = 'none';
    //     }
    // });

    if (!Array.isArray(backpackItems)) {
      throw new Error('Expected an array but received something else');
    }

    backpackContainer.innerHTML = '';

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

        // alert(`Using ${item.name} and ${item.effect_type} and ${item.effect_amount}`);
        console.log(item.name + " | " + item.effect_type)
        // logic to use the item goes here

      // Fetch users Pokemon and show them
        const pokemonData = await fetch(`/api/pokemon/team`);
        console.log(pokemonData);
        const pokemons = await pokemonData.json();
        console.log(pokemons)
        const pokemonContainer = document.getElementById('pokemon-container');

        pokemons.forEach(pokemon => {
          const pokemonDiv = document.createElement('div');
          pokemonDiv.classList.add('backpack-item');
          const pokemonName = document.createElement('button');
          pokemonName.classList.add('use-button');
          pokemonName.textContent = pokemon.name;
          pokemonName.value = pokemon.name;

          pokemonContainer.appendChild(pokemonName);

          console.log(pokemonName)

          pokemonName.addEventListener('click', async (event) => {
            const selectedPokemon = event.target.value;
            console.log("Selected:" + " " + selectedPokemon)

            // send info of pokemon in body
            const useOnPokemon = await fetch(`api/pokemon/item`, {
              method: 'POST',
              body: JSON.stringify({ effect_amount: item.effect_amount, item_id: item.id, id: pokemon.id }), //item.id remove 1 from backpack,
              headers: { 'Content-Type': 'application/json' }
            })

            if (useOnPokemon.ok) {
            // alert('Item used.')
          
            console.log('Pokemon CURED')
            } else {
              // alert('Failed to use item.');
              console.log('Failed to apply effect')
            }


          })

        });


        // Modal with Pokemons to choose from
        // openModal(`Select a Pokemon${pokemonData}`) // Show pokemon on message

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
      deleteButton.textContent = 'Delete';
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