/**
 * RAID 2026 - Sticky Navigation and UK Time Clock
 * This file handles the sticky navigation bar with integrated UK time clock
 */

// UK Time Clock Script
function updateUKTime() {
  const now = new Date();
  
  // Format time for UK (Europe/London timezone)
  const timeOptions = {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  
  const dateOptions = {
    timeZone: 'Europe/London',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  };
  
  const timeString = now.toLocaleTimeString('en-GB', timeOptions);
  const dateString = now.toLocaleDateString('en-GB', dateOptions);
  
  const clockElement = document.getElementById('ukClock');
  const dateElement = document.getElementById('ukDate');
  
  if (clockElement) clockElement.textContent = timeString;
  if (dateElement) dateElement.textContent = dateString;
}

// Initialize clock updates
function initializeUKClock() {
  updateUKTime();
  setInterval(updateUKTime, 1000);
}

// Sticky Navigation Control
function initializeStickyNav() {
  const mybutton = document.getElementById("myBtn");
  const stickyNav = document.getElementById('stickyNav');
  const heroHeight = 500;
  
  if (!stickyNav) return; // Exit if sticky nav doesn't exist
  
  window.onscroll = function() {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    
    // Show/hide sticky nav
    if (scrollTop > heroHeight) {
      stickyNav.style.top = '0';
    } else {
      stickyNav.style.top = '-150px';
    }
    
    // Show/hide scroll to top button
    if (mybutton) {
      if (scrollTop > 100) {
        mybutton.style.display = "block";
      } else {
        mybutton.style.display = "none";
      }
    }
  };
}

// Scroll to top function
function topFunction() {
  const rootElement = document.documentElement;
  rootElement.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

// Mobile Menu Functions
function toggleMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  const hamburger = document.querySelector('.hamburger-menu');
  
  mobileMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  hamburger.classList.toggle('active');
  
  // Prevent body scroll when menu is open
  if (mobileMenu.classList.contains('active')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeMobileMenu() {
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.menu-overlay');
  const hamburger = document.querySelector('.hamburger-menu');
  
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeUKClock();
  initializeStickyNav();
});
