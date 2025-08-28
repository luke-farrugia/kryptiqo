/*
 * Global script for the Kryptiqo site.
 *
 * This file now does the following:
 *   1. Keeps existing functionality for toggling the mobile navigation.
 *   2. Dynamically loads Firebase and initialises authentication when the page
 *      loads.  A placeholder configuration object is included; you must
 *      replace the properties with values from your own Firebase project.
 *   3. Injects “Login with Google” and “Login with Apple” buttons into the
 *      navigation bar on pages where a `.navbar-nav.ms-auto` element exists.
 *   4. Handles sign‑in with Google and Apple using Firebase Authentication,
 *      and updates the navigation bar to show a dashboard link and sign‑out
 *      option when a user is authenticated.
 *   5. Exposes the Firebase Auth instance globally as `window.firebaseAuth` so
 *      that other pages (e.g. members.html) can use it.
 */

// Initialise behaviour once the DOM has loaded
window.addEventListener('load', function () {
  // 1. Existing navbar toggler logic for mobile
  const toggler = document.querySelector('.navbar-toggler');
  const navCollapse = document.getElementById('navbarNav');
  if (toggler && navCollapse) {
    toggler.addEventListener('click', function () {
      navCollapse.classList.toggle('show');
    });
  }

  // Helper to load an external script asynchronously and return a promise
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load script: ' + src));
      document.head.appendChild(script);
    });
  }

  // 2. Load Firebase SDKs (version 8 compatibility build for ease of use)
  Promise.all([
    loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js'),
    loadScript('https://www.gstatic.com/firebasejs/8.10.1/firebase-auth.js')
  ]).then(() => {
    // 3. Initialise Firebase – REPLACE WITH YOUR OWN CONFIGURATION
    const firebaseConfig = {
      apiKey: 'REPLACE_WITH_YOUR_API_KEY',
      authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
      projectId: 'YOUR_PROJECT_ID',
      // You can include other config values (storageBucket, messagingSenderId, etc.)
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    const auth = firebase.auth();
    window.firebaseAuth = auth; // Expose for other pages

    // Providers for Google and Apple sign‑in
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    const appleProvider = new firebase.auth.OAuthProvider('apple.com');

    // Helper to inject login buttons into the navigation bar
    function injectLoginButtons(navList) {
      // Avoid duplicating the buttons
      if (document.getElementById('login-buttons')) return;
      const li = document.createElement('li');
      li.className = 'nav-item d-flex align-items-center';
      li.id = 'login-buttons';
      li.innerHTML = `
        <button id="google-signin" class="btn btn-outline-light btn-sm me-2">Login with Google</button>
        <button id="apple-signin" class="btn btn-outline-light btn-sm">Login with Apple</button>
      `;
      navList.appendChild(li);
    }

    // Helper to remove login buttons
    function removeLoginButtons() {
      const loginButtons = document.getElementById('login-buttons');
      if (loginButtons) loginButtons.remove();
    }

    // Helper to add dashboard and sign‑out links
    function addAuthenticatedLinks(navList) {
      if (!document.getElementById('dashboard-link')) {
        const dashboardLi = document.createElement('li');
        dashboardLi.className = 'nav-item';
        dashboardLi.id = 'dashboard-link';
        dashboardLi.innerHTML = '<a class="nav-link" href="members.html">Dashboard</a>';
        navList.appendChild(dashboardLi);
      }
      if (!document.getElementById('signout-link')) {
        const signoutLi = document.createElement('li');
        signoutLi.className = 'nav-item';
        signoutLi.id = 'signout-link';
        signoutLi.innerHTML = '<a class="nav-link" href="#" id="signout-btn">Logout</a>';
        navList.appendChild(signoutLi);
      }
    }

    // Helper to remove dashboard and sign‑out links
    function removeAuthenticatedLinks() {
      const dLink = document.getElementById('dashboard-link');
      const sLink = document.getElementById('signout-link');
      if (dLink) dLink.remove();
      if (sLink) sLink.remove();
    }

    // 4. Get reference to the navigation list (ms‑auto ensures it’s right‑aligned)
    const navList = document.querySelector('.navbar-nav.ms-auto');
    if (navList) {
      // Set up login buttons initially (before we know authentication state)
      injectLoginButtons(navList);

      // 5. Listen for auth state changes to update the UI
      auth.onAuthStateChanged(function (user) {
        if (user) {
          // User is signed in – show dashboard and sign out links
          removeLoginButtons();
          addAuthenticatedLinks(navList);
        } else {
          // User is signed out – show login buttons
          removeAuthenticatedLinks();
          injectLoginButtons(navList);
        }
      });

      // 6. Delegated click listeners for login and logout buttons
      document.addEventListener('click', function (e) {
        const target = e.target;
        if (!target) return;
        if (target.id === 'google-signin') {
          // Prevent default link behaviour
          e.preventDefault();
          auth.signInWithPopup(googleProvider).catch(function (error) {
            console.error('Google sign‑in error:', error);
          });
        }
        if (target.id === 'apple-signin') {
          e.preventDefault();
          auth.signInWithPopup(appleProvider).catch(function (error) {
            console.error('Apple sign‑in error:', error);
          });
        }
        if (target.id === 'signout-btn') {
          e.preventDefault();
          auth.signOut().catch(function (error) {
            console.error('Sign‑out error:', error);
          });
        }
      });
    }
  }).catch((err) => {
    console.error('Failed to load Firebase scripts:', err);
  });
});