// Function to update the wallet amount
async function updateWallet() {
    try {
        const walletResponse = await fetch('/api/wallet');
        if (!walletResponse.ok) {
            throw new Error('Failed to fetch wallet data');
        }

        const wallet = await walletResponse.json();

        const walletContainers = document.querySelectorAll('.wallet');
        walletContainers.forEach(container => {

            let walletValue = container.querySelector('.wallet-value');
            if (!walletValue) {
                walletValue = document.createElement('div');
                walletValue.classList.add('wallet-value', 'store-item', 'tooltip-container');
                container.appendChild(walletValue);
            }

            // Clear existing content
            walletValue.innerHTML = '';

            // Create and add the currency image
            const currencyImage = document.createElement('img');
            currencyImage.src = '/images/pokedollarlogo.png';
            currencyImage.alt = 'Currency';
            currencyImage.style.width = '50px';
            currencyImage.style.height = '70px';
            currencyImage.style.verticalAlign = 'middle';
            walletValue.appendChild(currencyImage);

            // Create and add the wallet value text
            const walletText = document.createTextNode(` ${wallet.value}`);
            walletValue.appendChild(walletText);

            // Create and add the tooltip message
            const tooltipText = document.createElement('div');
            tooltipText.classList.add('tooltip-text');
            tooltipText.textContent = 'This is your current Pokédollar amount'; 
            walletValue.appendChild(tooltipText);
        });
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
}

// Initial wallet update on page load
document.addEventListener('DOMContentLoaded', updateWallet);