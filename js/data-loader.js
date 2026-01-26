/**
 * RAID 2026 - CSV Data Loader
 * This file handles loading and parsing CSV data for accepted papers
 * Based on the reference code with version control mechanism
 */

// Data storage
const accepted_papers = new Map();
let papers_loaded = false;

/**
 * Get today's ISO date string for cache busting
 * Important: This function ensures the latest CSV file is reloaded daily
 * When you update the CSV, the browser will re-download due to the changed URL parameter
 */
function getTodayISODateString() {
  const d = new Date();
  return d.toISOString().substring(0, 10);
}

/**
 * Request CSV file with version control
 * @param {string} csvPath - Path to CSV file
 * @returns {Promise} Promise that resolves with CSV text
 */
function requestCSV(csvPath) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    // Add version parameter to prevent cache issues
    request.open("GET", csvPath + "?ver=" + getTodayISODateString());
    request.send();
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.responseText);
      } else {
        reject(new Error(`Failed to load ${csvPath}: ${request.status}`));
      }
    };
    request.onerror = () => reject(new Error(`Network error loading ${csvPath}`));
  });
}

/**
 * Parse CSV text to array of objects
 * @param {string} csvText - Raw CSV text
 * @returns {Array} Array of paper objects
 */
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const papers = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const paper = {};
    
    headers.forEach((header, index) => {
      paper[header] = values[index] || '';
    });
    
    papers.push(paper);
  }
  
  return papers;
}

/**
 * Load papers from CSV and store in Map
 * @param {string} csvText - Raw CSV text
 * Currently only stores id, title, and authors
 */
function loadPapersFromCSV(csvText) {
  const papers = parseCSV(csvText);
  
  papers.forEach(paper => {
    accepted_papers.set(paper.id, {
      id: paper.id,
      title: paper.title,
      authors: paper.authors
    });
  });
  
  papers_loaded = true;
  console.log(`Loaded ${accepted_papers.size} papers from CSV`);
}

/**
 * Main function to load data files
 * @param {string} csvPath - Optional custom CSV path (default: 'data/accepted_papers.csv')
 */
async function loadDataFiles(csvPath = 'data/accepted_papers.csv') {
  try {
    // Load accepted papers CSV
    console.log(`Loading CSV from: ${csvPath}`);
    const csvText = await requestCSV(csvPath);
    loadPapersFromCSV(csvText);
    
    // Render papers after loading
    if (papers_loaded) {
      renderAcceptedPapers();
    }
  } catch (error) {
    console.error('Error loading data files:', error);
    displayError('Failed to load accepted papers. Please try again later.');
  }
}

/**
 * Render accepted papers to the page
 * Currently displays only title and authors
 * To modify the display format, edit the HTML template below
 */
function renderAcceptedPapers() {
  const container = document.getElementById('acceptedPapersContainer');
  if (!container) {
    console.error('Container element not found');
    return;
  }
  
  let html = '';
  
  accepted_papers.forEach((paper, id) => {
    html += `
      <div class="info-card">
        <div class="row">
          <div class="col-md-2 text-center">
            <svg width="40px" height="40px" viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.505 22H5.495C5.225 22 4.995 21.78 4.995 21.5V3.5C4.995 3.23 5.215 3 5.495 3H18.505C18.775 3 19.005 3.22 19.005 3.5V21.51C18.995 21.78 18.775 22 18.505 22Z" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12.995 19H15.995" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.995 10H14.995" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.995 12H14.995" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.995 8H15.995" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.995 6H15.995" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7.995 14H13.425" stroke="#0F0F0F" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="col-md-10">
            <h4 style="margin-top: 0; margin-bottom: 8px; font-size: 18px;"><strong>${paper.title}</strong></h4>
            <p style="margin: 0; font-size: 15px; color: #555;">${paper.authors}</p>
          </div>
        </div>
      </div>
    `;
  });
  
  container.innerHTML = html;
}

/**
 * Display error message
 */
function displayError(message) {
  const container = document.getElementById('acceptedPapersContainer');
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        <strong>Error:</strong> ${message}
      </div>
    `;
  }
}

/**
 * Setup search functionality for papers
 */
function setupSearchFunctionality() {
  const searchInput = document.getElementById('paperSearch');
  const clearBtn = document.getElementById('clearSearchBtn');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      performSearch();
      // Show/hide clear button based on input
      if (clearBtn) {
        if (searchInput.value.trim() !== '') {
          clearBtn.classList.add('active');
        } else {
          clearBtn.classList.remove('active');
        }
      }
    });
  }
}

/**
 * Perform search on papers
 */
function performSearch() {
  const searchInput = document.getElementById('paperSearch');
  const papersContainer = document.getElementById('acceptedPapersContainer');
  const searchStats = document.getElementById('searchStats');
  
  if (!searchInput || !papersContainer || !searchStats) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const papers = papersContainer.querySelectorAll('.info-card');
  let visibleCount = 0;
  
  if (searchTerm === '') {
    // Show all papers
    papers.forEach(paper => paper.style.display = '');
    searchStats.textContent = '';
  } else {
    // Filter papers
    papers.forEach(paper => {
      const paperText = paper.textContent.toLowerCase();
      if (paperText.includes(searchTerm)) {
        paper.style.display = '';
        visibleCount++;
      } else {
        paper.style.display = 'none';
      }
    });
    searchStats.textContent = `Found ${visibleCount} of ${papers.length} papers`;
  }
}

/**
 * Clear search input and reset display
 */
function clearSearch() {
  const searchInput = document.getElementById('paperSearch');
  const searchStats = document.getElementById('searchStats');
  const clearBtn = document.getElementById('clearSearchBtn');
  
  if (searchInput) searchInput.value = '';
  if (searchStats) searchStats.textContent = '';
  if (clearBtn) clearBtn.classList.remove('active');
  
  performSearch();
}

// Auto-load data when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Only load if we're on the accepted papers page
  const container = document.getElementById('acceptedPapersContainer');
  if (container) {
    // Check if container has a custom CSV path attribute
    const customPath = container.getAttribute('data-csv-path');
    loadDataFiles(customPath || 'data/accepted_papers.csv');
    setupSearchFunctionality();
  }
});
