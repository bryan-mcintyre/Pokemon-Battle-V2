document.addEventListener('DOMContentLoaded', () => {
    // Function to apply the animation
    const applyAnimation = () => {
        const itemCards = document.querySelectorAll('.store-item, .backpack-item');

        itemCards.forEach((card) => {
            const itemImage = card.querySelector('img');

            if (itemImage) {
                let hoverAnimation = null;

                card.addEventListener('mouseover', () => {
                    if (!hoverAnimation) {
                        hoverAnimation = gsap.to(itemImage, { 
                            scale: 1.4, 
                            duration: 0.4, 
                            ease: "power1.inOut", 
                            repeat: -1, 
                            yoyo: true 
                        });
                    }
                });

                card.addEventListener('mouseout', () => {
                    if (hoverAnimation) {
                        hoverAnimation.kill();
                        hoverAnimation = null;
                        gsap.to(itemImage, { scale: 1, duration: 0.4, ease: "power1.inOut" });
                    }
                });
            }
        });
    };

    applyAnimation();

    const observer = new MutationObserver(applyAnimation);

    const storeContainer = document.getElementById('store-items');
    if (storeContainer) {
        observer.observe(storeContainer, { childList: true });
    }

    const backpackContainer = document.getElementById('backpack-items');
    if (backpackContainer) {
        observer.observe(backpackContainer, { childList: true });
    }
});