import React, { useEffect } from 'react';
// import '../stylesstyles.css'; // Import your styles

const StarsBackground: React.FC = () => {
  useEffect(() => {
    const starCount = 100; // Number of stars
    const starsContainer = document.querySelector('.starsBackground') as HTMLElement;

    if (starsContainer) {
      // Create stars dynamically
      for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star'); // Add class 'star'

        // Randomize position, size, animation delay, and animation speed
        const size = Math.random() * 3 + 1 + 'px'; // Star size between 1px and 4px
        const xPos = Math.random() * window.innerWidth + 'px'; // Random x position
        const yPos = Math.random() * window.innerHeight + 'px'; // Random y position
        const animationDelay = Math.random() * 2 + 's'; // Random animation delay

        // Apply random styles
        star.style.width = size;
        star.style.height = size;
        star.style.left = xPos;
        star.style.top = yPos;
        star.style.animationDelay = animationDelay;

        // Append the star to the container
        starsContainer.appendChild(star);
      }
    }

    // Cleanup stars when component unmounts
    return () => {
      if (starsContainer) {
        starsContainer.innerHTML = ''; // Remove all stars on unmount
      }
    };
  }, []);

  return <div className="starsBackground"></div>;
};

export default StarsBackground;
