const tlBattle = gsap.timeline({ repeat: -1 });

tlBattle.to("#image-left", {
  x: 500, // Move right
  duration: 0.5,
  ease: "power1.inOut",
  onComplete: () => {
    gsap.to("#image-right", {
      opacity: 0.5, // Blink effect
      repeat: 3,
      yoyo: true,
      duration: 0.1,
    });
  }
})
.to("#image-left", {
  x: 0, // Move back
  duration: 0.5,
  ease: "power1.inOut"
}, "+=0.2") // Delay before moving back
.to("#image-right", {
  x: -500, // Move left
  duration: 0.5,
  ease: "power1.inOut",
  onComplete: () => {
    gsap.to("#image-left", {
      opacity: 0.5, // Blink effect
      repeat: 3,
      yoyo: true,
      duration: 0.1,
    });
  }
}, "+=0.2") // Delay before moving left
.to("#image-right", {
  x: 0, // Move back
  duration: 0.5,
  ease: "power1.inOut"
}, "+=0.5"); // Delay before moving back