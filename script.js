// Placeholder script file for Kryptiqo optimised site.
// Add interactivity or analytics customization here if needed.

// Initialize navbar collapse toggling on mobile
window.addEventListener('load', function() {
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.getElementById('navbarNav');
  if (toggler && navCollapse) {
    toggler.addEventListener('click', function() {
      navCollapse.classList.toggle('show');
    });
  }
});
