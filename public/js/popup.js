const tlPopup = gsap.timeline({ repeat: -1, delay: 1 });
tlPopup.fromTo("#popup-image", 
  { y: "100%", opacity: 0 }, // Start position (off-screen bottom)
  { y: "20%", opacity: 1, duration: 3, ease: "power1.inOut" }) // Move up, not too high
  .to("#popup-image", { duration: 1 }) // Pause for 1 second
  .to("#popup-image", { y: "100%", opacity: 0, duration: 3, ease: "power1.inOut" });