// Kryptiqo client‑side behaviour
//
// This script handles the simple password protection for the admin page
// and provides basic management functionality for adding new affiliate
// offers and article entries. Data entered here is appended to lists on
// the admin page for demonstration purposes. In a production
// environment, you would implement proper authentication and a
// database-backed API.

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const adminPanel = document.getElementById('admin-panel');
  const passwordInput = document.getElementById('password');
  const message = document.getElementById('message');
  const addOfferForm = document.getElementById('add-offer-form');
  const offerList = document.getElementById('offer-items');
  const addArticleForm = document.getElementById('add-article-form');
  const articleList = document.getElementById('article-items');

  // Hard‑coded password. Change this value to secure your admin area.
  const ADMIN_PASSWORD = 'admin123';

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (passwordInput.value === ADMIN_PASSWORD) {
        loginForm.classList.add('hidden');
        adminPanel.classList.remove('hidden');
        message.textContent = '';
      } else {
        message.textContent = 'Incorrect password. Please try again.';
      }
      passwordInput.value = '';
    });
  }

  if (addOfferForm) {
    addOfferForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = this.querySelector('[name="offerName"]').value.trim();
      const url = this.querySelector('[name="offerUrl"]').value.trim();
      const desc = this.querySelector('[name="offerDesc"]').value.trim();
      const fileInput = this.querySelector('[name="offerImage"]');
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (name && url) {
        // Create the list item outside of the FileReader so we can reuse logic
        const li = document.createElement('li');
        const renderOffer = (imageSrc) => {
          const imgHtml = imageSrc ? `<img src="${imageSrc}" alt="${name} banner" style="max-width:150px;display:block;margin-bottom:0.5rem;">` : '';
          li.innerHTML = `${imgHtml}<strong>${name}</strong> – <a href="${url}" target="_blank">${url}</a><p>${desc}</p>`;
          offerList.appendChild(li);
          // Reset the form after rendering
          addOfferForm.reset();
        };
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            renderOffer(event.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          renderOffer(null);
        }
      }
    });
  }

  if (addArticleForm) {
    addArticleForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const title = this.querySelector('[name="articleTitle"]').value.trim();
      const slug = this.querySelector('[name="articleSlug"]').value.trim();
      const desc = this.querySelector('[name="articleDesc"]').value.trim();
      if (title && slug) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${title}</strong> – <a href="${slug}">${slug}</a><p>${desc}</p>`;
        articleList.appendChild(li);
        this.reset();
      }
    });
  }

  // Navbar toggler fallback for mobile view
  // MDB's collapse component sometimes requires explicit toggling
  // manually add show/hide behaviour on click to ensure the hamburger
  // menu functions properly on all devices
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.getElementById('navbarNav');
  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener('click', () => {
      navbarCollapse.classList.toggle('show');
    });
  }
});