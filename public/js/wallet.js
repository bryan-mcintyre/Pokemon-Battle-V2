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
                
                walletValue = document.createElement('p');
                walletValue.classList.add('wallet-value', 'store-item'); 
                container.appendChild(walletValue);
            }
    
            walletValue.textContent = `Your gold: ¥${wallet.value}`;
        });
    } catch (error) {
        console.error('Error fetching wallet data:', error);
    }
}

// Initial wallet update on page load
document.addEventListener('DOMContentLoaded', updateWallet);