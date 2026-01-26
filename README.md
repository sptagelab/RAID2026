# RAID 2026 Official Website

Official Website for The 29th International Symposium on Research in Attacks, Intrusions and Defenses (RAID 2026)

## Directory Structure

- **css/** (Website stylesheets)
  
  - style.css (Main theme CSS file - contains global styles and component styles)

- **js/** (JavaScript files for website functionality)
  
  - template-loader.js (Loads header and footer templates dynamically)
  
  - navigation.js (Handles navigation bar, UK time clock, scroll-to-top, and sticky navigation)
  
  - data-loader.js (Loads and renders accepted papers from CSV, includes search functionality)

- **includes/** (Reusable HTML templates)
  
  - header.html (Navigation bar and mobile menu template)
  
  - footer.html (Footer template)

- **data/** (Data files for dynamic content)
  
  - test_accepted_papers.csv (Test data for development accepted papers page)

- **images/** (Website images and graphics)
  
  - Lancaster_ThingsToDo*.jpg (Images for "Things to Do" section in visit_lancaster.html)

  - logo_*.png/.webp (Logos of sponsors and partners)
  
  - Other conference-related images

- example/ (Example HTML files for development and testing)
  
  - accepted.html (Example accepted papers page using test data)

## Updating Content

### Adding/Updating Accepted Papers

1. Edit `data/test_accepted_papers.csv` with the following format:
   ```csv
   id,title,authors
   P001,Paper Title,Author1; Author2; Author3
   P002,Another Paper,Author4; Author5
   ```

2. Multiple authors should be separated by semicolons (`;`)

3. If title or authors contain commas, wrap them in quotes: `"Title, with comma","Author, Name"`

4. The browser will automatically load new data the next day (or force refresh with Cmd+Shift+R)

### Adding New Pages

1. Copy an existing HTML file as template

2. Ensure it includes the template placeholders:
   ```html
   <div id="header-placeholder"></div>
   <!-- Your page content -->
   <div id="footer-placeholder"></div>
   ```

3. Include required scripts before closing `</body>` tag:
   ```html
   <script src="js/template-loader.js"></script>
   <script src="js/navigation.js"></script>
   ```

4. To add the new page to navigation, edit only `includes/header.html`

## JavaScript Architecture

### template-loader.js
- Loads header and footer from `includes/` directory
- Auto-highlights current page in navigation
- Runs on all pages

### navigation.js
- UK time clock display
- Sticky navigation on scroll
- Scroll-to-top button
- One `DOMContentLoaded` listener for all pages

### data-loader.js
- CSV parsing and data loading
- Accepted papers rendering
- Search functionality
- Error handling
- Separate `DOMContentLoaded` listener for accepted papers page only

## To-Do List
### Get program PDFs
- **downloads/** (Downloadable PDF files)

  - program_day*.pdf (Conference program PDFs for each day)
