/**
 * Template Loader - Loads header and footer templates
 * This allows maintaining nav and footer in one place
 */

// Get current page name for active link highlighting
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  return page.replace('.html', '');
}

// Load header template
function loadHeader() {
  const currentPage = getCurrentPage();
  
  fetch('includes/header.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('header-placeholder').innerHTML = html;
      
      // Highlight active page in desktop nav
      const desktopNavLink = document.querySelector(`.nav-${currentPage}`);
      if (desktopNavLink) {
        desktopNavLink.classList.remove('btn-raid-outline');
        desktopNavLink.classList.add('btn-raid');
      }
      
      // Highlight active page in mobile nav
      const mobileNavLink = document.querySelector(`.mobile-nav-${currentPage}`);
      if (mobileNavLink) {
        mobileNavLink.classList.add('active');
      }
      
      // Initialize navigation features after header is loaded
      if (typeof initializeUKClock === 'function') {
        initializeUKClock();
      }
      if (typeof initializeStickyNav === 'function') {
        initializeStickyNav();
      }
    })
    .catch(error => console.error('Error loading header:', error));
}

// Load footer template
function loadFooter() {
  fetch('includes/footer.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('footer-placeholder').innerHTML = html;
    })
    .catch(error => console.error('Error loading footer:', error));
}

// Load templates when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadFooter();
});
