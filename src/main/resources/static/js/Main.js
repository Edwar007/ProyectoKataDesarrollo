// Inject navbar into any page
document.addEventListener("DOMContentLoaded", () => {
  fetch("navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
    })
    .catch((error) => {
      console.error("Error loading navbar:", error);
    });
});

// Load navbar
document.addEventListener("DOMContentLoaded", () => {
  fetch("Navbar.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("navbar-container").innerHTML = data;
      setupDropdowns(); // Activar comportamiento de clics
    });
});

// Dropdowns por clic
function setupDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
    const button = dropdown.querySelector('.dropbtn');
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllDropdowns(dropdown); // Cierra otros abiertos
      dropdown.classList.toggle('show');
    });
  });

  // Cierra todo si haces clic afuera
  document.addEventListener('click', () => {
    closeAllDropdowns();
  });
}

function closeAllDropdowns(except = null) {
  document.querySelectorAll('[data-dropdown]').forEach(dropdown => {
    if (dropdown !== except) {
      dropdown.classList.remove('show');
    }
  });
}
