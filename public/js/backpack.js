document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/api/backpack');
    const backpackItems = await response.json();
  
    const backpackContainer = document.getElementById('backpack-items');
    
    backpackItems.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.classList.add('backpack-item');
  
      const itemImage = document.createElement('img');
      itemImage.src = item.image;
      itemImage.alt = item.name;
  
      const itemName = document.createElement('h2');
      itemName.textContent = item.name;
  
      const itemCount = document.createElement('p');
      itemCount.textContent = `Quantity: ${item.count}`;
  
      itemDiv.appendChild(itemImage);
      itemDiv.appendChild(itemName);
      itemDiv.appendChild(itemCount);
  
      backpackContainer.appendChild(itemDiv);
    });
  });