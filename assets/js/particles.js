particlesJS("particles-js", {
    particles: {
      number: { value: 80, density: { enable: true, value_area: 800 } },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
      move: { enable: true, speed: 2, direction: "none", random: false, straight: false }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" }
      }
    },
    retina_detect: true
  });

  const particleColors = [
    ["#ff0000", "#ff7300"], // Red-Orange
    ["#ff7300", "#ffeb00"], // Orange-Yellow
    ["#00ff00", "#00ffeb"], // Green-Cyan
    ["#00ffeb", "#0073ff"], // Cyan-Blue
    ["#0073ff", "#8b00ff"], // Blue-Purple
    ["#8b00ff", "#ff0000"]  // Purple-Red
  ];
  
  // Function to get a random gradient color pair
  function getRandomGradient() {
    return particleColors[Math.floor(Math.random() * particleColors.length)];
  }
  
  // Initialize Particles.js
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: getRandomGradient() // Assign a random color gradient pair
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.8,
        random: true
      },
      size: {
        value: 5,
        random: true
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: getRandomGradient()[1], // Use second color in the gradient pair
        opacity: 0.5,
        width: 1
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: false,
        straight: false,
        out_mode: "out",
        bounce: false
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "repulse"
        },
        onclick: {
          enable: true,
          mode: "push"
        },
        resize: true
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4
        }
      }
    },
    retina_detect: true
  });