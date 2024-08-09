document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('/api/backpack');
    const backpackItems = await response.json();
    const backpackContainer = document.getElementById('backpack-items');

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
      useButton.addEventListener('click', () => {
        alert(`Using ${item.name}`);
        // logic to use the item goes here
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