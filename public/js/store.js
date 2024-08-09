document.addEventListener('DOMContentLoaded', () => {
  const storeItems = [
      {
          name: 'Potion',
          effect: 'Heals half HP',
          cost: 25,
          max: 10,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png'
      },
      {
          name: 'Hyper Potion',
          effect: 'Heals full HP',
          cost: 100,
          max: 10,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/hyper-potion.png'
      },
      {
          name: 'Revive',
          effect: 'Revives pokemon back to half HP',
          cost: 125,
          max: 10,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png'
      },
      {
          name: 'Pokeball',
          effect: '25% chance to catch',
          cost: 25,
          max: 10,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
      },
      {
          name: 'Ultra Ball',
          effect: '65% chance to catch',
          cost: 300,
          max: 5,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png'
      },
      {
          name: 'Master Ball',
          effect: '100% chance to catch',
          cost: 1500,
          max: 1,
          image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'
      },
  ];

  const storeContainer = document.getElementById('store-items');
  const modal = document.querySelector('.store-modal');
  const modalMessage = document.getElementById('purchaseMessage');
  const closeButton = document.querySelector('.close-button');

  // Function to open the modal
  function openModal(message) {
      modalMessage.textContent = message;
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

  storeItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('store-item');

      const itemImage = document.createElement('img');
      itemImage.src = item.image;
      itemImage.alt = item.name;

      const itemName = document.createElement('h2');
      itemName.textContent = item.name;

      const itemEffect = document.createElement('p');
      itemEffect.textContent = item.effect;

      const itemCost = document.createElement('p');
      itemCost.textContent = `Cost: ${item.cost} gold`;

      const quantityLabel = document.createElement('label');
      quantityLabel.textContent = 'Quantity:';
      quantityLabel.classList.add('quantity-label');

      const quantitySelect = document.createElement('select');
      for (let i = 1; i <= item.max; i++) {
          const option = document.createElement('option');
          option.value = i;
          option.textContent = i;
          quantitySelect.appendChild(option);
      }

      const purchaseButton = document.createElement('button');
      purchaseButton.textContent = 'Purchase';
      purchaseButton.classList.add('purchase-button');
      purchaseButton.addEventListener('click', async () => {
          const quantity = quantitySelect.value;
          const response = await fetch('/api/store/purchase', {
              method: 'POST',
              body: JSON.stringify({ item: item.name, quantity: parseInt(quantity, 10) }),
              headers: { 'Content-Type': 'application/json' },
          });

          if (response.ok) {
              openModal(`You have successfully purchased ${quantity} ${item.name}(s) for ${item.cost * quantity} gold.`);
              await updateWallet();
          } else {
              openModal('Failed to purchase item.');
          }
      });

      itemDiv.appendChild(itemImage);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemEffect);
      itemDiv.appendChild(itemCost);
      itemDiv.appendChild(quantityLabel);
      itemDiv.appendChild(quantitySelect);
      itemDiv.appendChild(purchaseButton);

      storeContainer.appendChild(itemDiv);
  });
});