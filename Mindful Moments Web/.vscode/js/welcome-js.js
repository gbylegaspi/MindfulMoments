document.addEventListener("DOMContentLoaded", () => {
    // Ask for user's name
    const userName = prompt("Hi there! What's your name? 😊");
  
    // Personalize welcome message if a name is entered
    if (userName && userName.trim() !== "") {
      const heading = document.querySelector("h1");
      heading.textContent = `Welcome to MoodTrack, ${userName}! 🌈`;
    }
  
    // Animate the 'Start Tracking' button on hover
    const button = document.querySelector(".enter-button");
  
    button.addEventListener("mouseover", () => {
      button.style.transform = "scale(1.05)";
      button.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
    });
  
    button.addEventListener("mouseout", () => {
      button.style.transform = "scale(1)";
      button.style.boxShadow = "none";
    });
  
    // Add a gentle pulse animation to the button every few seconds
    setInterval(() => {
      button.classList.add("pulse");
      setTimeout(() => button.classList.remove("pulse"), 1000);
    }, 5000);
  });
  