const tlBattle = gsap.timeline({ repeat: -1 });

tlBattle.to("#image-left-pika", {
  x: 350, 
  duration: 0.5,
  ease: "power1.inOut",
  onComplete: () => {
    gsap.to("#image-right-char", {
      opacity: 0.5, 
      repeat: 3,
      yoyo: true,
      duration: 0.1,
    });
  }
})
.to("#image-left-pika", {
  x: 0, 
  duration: 0.5,
  ease: "power1.inOut"
}, "+=0.2") 
.to("#image-right-char", {
  x: -350, 
  duration: 0.5,
  ease: "power1.inOut",
  onComplete: () => {
    gsap.to("#image-left-pika", {
      opacity: 0.5,
      repeat: 3,
      yoyo: true,
      duration: 0.1,
    });
  }
}, "+=0.2") 
.to("#image-right-char", {
  x: 0, 
  duration: 0.5,
  ease: "power1.inOut"
}, "+=0.5"); 