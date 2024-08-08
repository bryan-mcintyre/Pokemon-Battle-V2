document.addEventListener('DOMContentLoaded',async () => {
    const response = await fetch('/api/wallet');
    const wallet = await response.json();

    const walletContainer = document.getElementById('wallet');

const walletValue = document.createElement('p');
walletValue.textContent = `Money: ¥${wallet.value}`;

walletValue.classList.add('store-item');



walletContainer.appendChild(walletValue);


});