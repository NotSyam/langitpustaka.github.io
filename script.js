/**
 * =====================================================
 * LANGIT PUSTAKA - JAVASCRIPT FUNCTIONALITY
 * =====================================================
 * 
 * Table of Contents:
 * 1. Data Management
 * 2. DOM Element References
 * 3. Search Functionality
 * 4. Category Filtering
 * 5. Theme Management
 * 6. Carousel Functionality
 * 7. Navigation Handlers
 * 8. Utility Functions
 * 9. Event Listeners
 * 10. Initialization
 * 
 * =====================================================
 */

/**
 * ===== 1. DATA MANAGEMENT =====
 * Central data store for all books with enhanced metadata
 */
const bookData = [
    {
        id: 1,
        title: "Perahu Kertas",
        category: "Fiksi",
        image: "image/Perahu Kertas.jpg",
        link: "https://onedrive.live.com/?id=root&cid=harry-potter",
        author: "Dee Lestari",
        description: "Novel romantis yang mengisahkan perjalanan cinta dan mimpi"
    },
    {
        id: 2,
        title: "Dilan",
        category: "Fiksi",
        image: "image/Dilan.jpg",
        link: "https://drive.google.com/file/d/rich-dad-poor-dad",
        author: "Pidi Baiq",
        description: "Kisah cinta remaja yang mengharukan dan penuh kenangan"
    },
    {
        id: 3,
        title: "The Midnight Library",
        category: "Fiksi",
        image: "image/The Midnight Library.jpg",
        link: "https://drive.google.com/file/d/rich-dad-poor-dad",
        author: "Matt Haig",
        description: "Perpustakaan ajaib yang memungkinkan menjelajahi kehidupan alternatif"
    },
    {
        id: 4,
        title: "Who Moved My Cheese?",
        category: "Self Improvement",
        image: "image/Who Moved My Cheese.jpg",
        link: "https://drive.google.com/file/d/atomic-habits",
        author: "Spencer Johnson",
        description: "Panduan praktis menghadapi perubahan dalam hidup dan karir"
    },
    {
        id: 5,
        title: "Filosofi Teras",
        category: "Self Improvement",
        image: "image/Filosofi Teras.jpg",
        link: "https://drive.google.com/file/d/filosofi-teras",
        author: "Henry Manampiring",
        description: "Penerapan filosofi Stoik untuk kehidupan modern yang lebih tenang"
    },
    {
        id: 6,
        title: "Thinking, Fast and Slow",
        category: "Self Improvement",
        image: "image/Thinking, Fast and Slow.jpg",
        link: "https://drive.google.com/file/d/filosofi-teras",
        author: "Daniel Kahneman",
        description: "Pemahaman mendalam tentang cara kerja pikiran manusia"
    },
    {
        id: 7,
        title: "Metode Penelitian Kuantitatif, Kualitatif & Penelitian Gabungan",
        category: "Edukasi",
        image: "image/Metode Penelitian Kuantitatif, Kualitatif & Penelitian Gabungan.jpg",
        link: "https://onedrive.live.com/?id=root&cid=biologi-dasar",
        author: "John W. Creswell",
        description: "Panduan komprehensif metodologi penelitian untuk akademisi"
    },
    {
        id: 8,
        title: "Pendidikan Karakter Anak: Sesuai Pembelajaran Abad ke-21",
        category: "Edukasi",
        image: "image/Pendidikan Karakter Anak.jpg",
        link: "https://onedrive.live.com/?id=root&cid=biologi-dasar",
        author: "Daryanto",
        description: "Strategi pembentukan karakter anak di era digital"
    },
    {
        id: 9,
        title: "Teori-Teori Manajemen Sumber Daya Manusia",
        category: "Edukasi",
        image: "image/Teori Manajemen SDM.png",
        link: "https://onedrive.live.com/?id=root&cid=biologi-dasar",
        author: "Veithzal Rivai",
        description: "Konsep dan praktik manajemen SDM dalam organisasi modern"
    }
];

/**
 * ===== 2. DOM ELEMENT REFERENCES =====
 * Centralized DOM element management for better performance
 */
class DOMManager {
    constructor() {
        // Search elements
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        
        // Navigation elements
        this.homeLink = document.getElementById('homeLink');
        this.themeToggle = document.getElementById('themeToggle');
        this.categoryItems = document.querySelectorAll('.dropdown-item');
        
        // Carousel elements
        this.carouselItems = document.querySelectorAll('.carousel-item');
        this.carouselIndicators = document.querySelectorAll('.indicator');
        this.prevControl = document.querySelector('.carousel-control.prev');
        this.nextControl = document.querySelector('.carousel-control.next');
        this.bookLinks = document.querySelectorAll('.book-link');
        
        // Verify all elements exist
        this.verifyElements();
    }
    
    /**
     * Verify that all critical DOM elements exist
     */
    verifyElements() {
        const requiredElements = [
            'searchInput', 'searchResults', 'homeLink', 
            'themeToggle', 'prevControl', 'nextControl'
        ];
        
        requiredElements.forEach(elementName => {
            if (!this[elementName]) {
                console.warn(`Warning: ${elementName} element not found`);
            }
        });
    }
}

/**
 * ===== 3. SEARCH FUNCTIONALITY =====
 * Enhanced search with debouncing and fuzzy matching
 */
class SearchManager {
    constructor(domManager) {
        this.dom = domManager;
        this.searchTimeout = null;
        this.lastQuery = '';
    }
    
    /**
     * Initialize search functionality
     */
    init() {
        if (this.dom.searchInput) {
            this.dom.searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            // Handle Enter key
            this.dom.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });
        }
    }
    
    /**
     * Handle search with debouncing
     * @param {string} query - Search query
     */
    handleSearch(query) {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        // Debounce search
        this.searchTimeout = setTimeout(() => {
            this.performSearch(query);
        }, 300);
    }
    
    /**
     * Perform the actual search
     * @param {string} query - Search query
     */
    performSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        // Hide results if query is empty
        if (trimmedQuery === '') {
            this.hideResults();
            return;
        }
        
        // Avoid duplicate searches
        if (trimmedQuery === this.lastQuery) {
            return;
        }
        
        this.lastQuery = trimmedQuery;
        
        // Filter books
        const filteredBooks = this.filterBooks(trimmedQuery);
        
        // Display results
        this.displayBooks(filteredBooks, `Hasil Pencarian: "${query}"`);
    }
    
    /**
     * Filter books based on search query
     * @param {string} query - Search query
     * @returns {Array} Filtered books
     */
    filterBooks(query) {
        return bookData.filter(book => {
            return (
                book.title.toLowerCase().includes(query) ||
                book.author?.toLowerCase().includes(query) ||
                book.category.toLowerCase().includes(query) ||
                book.description?.toLowerCase().includes(query)
            );
        });
    }
    
    /**
     * Display search results
     * @param {Array} books - Array of books to display
     * @param {string} title - Title for the results section
     */
    displayBooks(books, title = "Hasil Pencarian") {
        if (!this.dom.searchResults) return;
        
        this.dom.searchResults.innerHTML = '';
        this.dom.searchResults.style.display = 'block';
        
        if (books.length > 0) {
            const resultsHTML = `
                <h2 class="results-title">${title}</h2>
                <div class="book-list">
                    ${books.map(book => this.createBookCard(book)).join('')}
                </div>
            `;
            this.dom.searchResults.innerHTML = resultsHTML;
        } else {
            const noResultsHTML = `
                <h2 class="results-title">${title}</h2>
                <p class="no-results">
                    Tidak ada hasil yang ditemukan. Coba gunakan kata kunci yang berbeda.
                </p>
            `;
            this.dom.searchResults.innerHTML = noResultsHTML;
        }
        
        // Smooth scroll to results
        this.dom.searchResults.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
    
    /**
     * Create HTML for a book card
     * @param {Object} book - Book object
     * @returns {string} HTML string
     */
    createBookCard(book) {
        const truncatedTitle = this.truncateText(book.title, 50);
        const truncatedDescription = this.truncateText(book.description || '', 80);
        
        return `
            <div class="book-card" data-book-id="${book.id}">
                <img src="${book.image}" alt="${book.title}" loading="lazy">
                <div class="book-title" title="${book.title}">${truncatedTitle}</div>
                <div class="book-category">${book.category}</div>
                <div class="book-author" style="font-size: 0.75rem; color: var(--text-light); margin-bottom: var(--space-xs);">
                    ${book.author || 'Unknown Author'}
                </div>
                <a href="${book.link}" 
                   target="_blank" 
                   class="btn"
                   onclick="analytics.trackBookClick('${book.title}', '${book.category}')">
                    Baca Sekarang
                </a>
            </div>
        `;
    }
    
    /**
     * Truncate text to specified length
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }
    
    /**
     * Hide search results
     */
    hideResults() {
        if (this.dom.searchResults) {
            this.dom.searchResults.style.display = 'none';
        }
        this.lastQuery = '';
    }
    
    /**
     * Clear search
     */
    clearSearch() {
        if (this.dom.searchInput) {
            this.dom.searchInput.value = '';
        }
        this.hideResults();
    }
}

/**
 * ===== 4. CATEGORY FILTERING =====
 * Enhanced category management
 */
class CategoryManager {
    constructor(domManager, searchManager) {
        this.dom = domManager;
        this.search = searchManager;
    }
    
    /**
     * Initialize category functionality
     */
    init() {
        this.dom.categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryClick(item);
            });
        });
    }
    
    /**
     * Handle category click
     * @param {Element} item - Clicked category item
     */
    handleCategoryClick(item) {
        const category = item.getAttribute('data-category');
        
        if (!category) return;
        
        // Filter books by category
        const filteredBooks = bookData.filter(book => book.category === category);
        
        // Display filtered results
        this.search.displayBooks(filteredBooks, `Kategori: ${category}`);
        
        // Clear search input
        if (this.dom.searchInput) {
            this.dom.searchInput.value = '';
        }
        
        // Track analytics
        analytics.trackCategoryFilter(category);
    }
}

/**
 * ===== 5. THEME MANAGEMENT =====
 * Enhanced theme switching with persistence
 */
class ThemeManager {
    constructor(domManager) {
        this.dom = domManager;
        this.currentTheme = this.getStoredTheme() || 'light';
    }
    
    /**
     * Initialize theme functionality
     */
    init() {
        // Set initial theme
        this.applyTheme(this.currentTheme);
        
        // Add click listener
        if (this.dom.themeToggle) {
            this.dom.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    
    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        this.storeTheme(this.currentTheme);
        
        // Track analytics
        analytics.trackThemeChange(this.currentTheme);
    }
    
    /**
     * Apply theme to document
     * @param {string} theme - Theme name ('light' or 'dark')
     */
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        
        if (this.dom.themeToggle) {
            this.dom.themeToggle.textContent = theme === 'light' ? 'Mode Gelap' : 'Mode Terang';
        }
    }
    
    /**
     * Store theme preference
     * @param {string} theme - Theme to store
     */
    storeTheme(theme) {
        try {
            localStorage.setItem('langit-pustaka-theme', theme);
        } catch (e) {
            console.warn('Could not store theme preference:', e);
        }
    }
    
    /**
     * Get stored theme preference
     * @returns {string|null} Stored theme or null
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('langit-pustaka-theme');
        } catch (e) {
            console.warn('Could not retrieve theme preference:', e);
            return null;
        }
    }
}

/**
 * ===== 6. CAROUSEL FUNCTIONALITY =====
 * Enhanced carousel with touch support and accessibility
 */
class CarouselManager {
    constructor(domManager) {
        this.dom = domManager;
        this.currentIndex = 0;
        this.totalItems = this.dom.carouselItems.length;
        this.autoSlideInterval = null;
        this.isAutoSliding = true;
        this.touchStartX = 0;
        this.touchEndX = 0;
    }
    
    /**
     * Initialize carousel functionality
     */
    init() {
        if (this.totalItems === 0) return;
        
        // Set up controls
        this.setupControls();
        
        // Set up indicators
        this.setupIndicators();
        
        // Set up touch support
        this.setupTouchSupport();
        
        // Set up keyboard support
        this.setupKeyboardSupport();
        
        // Start auto-slide
        this.startAutoSlide();
        
        // Pause on hover
        this.setupHoverPause();
    }
    
    /**
     * Set up carousel controls
     */
    setupControls() {
        if (this.dom.prevControl) {
            this.dom.prevControl.addEventListener('click', () => {
                this.previousSlide();
            });
        }
        
        if (this.dom.nextControl) {
            this.dom.nextControl.addEventListener('click', () => {
                this.nextSlide();
            });
        }
    }
    
    /**
     * Set up carousel indicators
     */
    setupIndicators() {
        this.dom.carouselIndicators.forEach(indicator => {
            indicator.addEventListener('click', () => {
                const index = parseInt(indicator.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
    }
    
    /**
     * Set up touch support for mobile
     */
    setupTouchSupport() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        carousel.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });
        
        carousel.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
    }
    
    /**
     * Handle swipe gesture
     */
    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }
    
    /**
     * Set up keyboard support
     */
    setupKeyboardSupport() {
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.carousel')) {
                switch (e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousSlide();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextSlide();
                        break;
                }
            }
        });
    }
    
    /**
     * Set up hover pause functionality
     */
    setupHoverPause() {
        const carousel = document.querySelector('.carousel');
        if (!carousel) return;
        
        carousel.addEventListener('mouseenter', () => {
            this.pauseAutoSlide();
        });
        
        carousel.addEventListener('mouseleave', () => {
            this.resumeAutoSlide();
        });
    }
    
    /**
     * Go to next slide
     */
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalItems;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    /**
     * Go to previous slide
     */
    previousSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.updateCarousel();
        this.resetAutoSlide();
    }
    
    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goToSlide(index) {
        if (index >= 0 && index < this.totalItems) {
            this.currentIndex = index;
            this.updateCarousel();
            this.resetAutoSlide();
        }
    }
    
    /**
     * Update carousel display
     */
    updateCarousel() {
        // Update items
        this.dom.carouselItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update indicators
        this.dom.carouselIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    /**
     * Start auto-slide
     */
    startAutoSlide() {
        if (this.totalItems > 1) {
            this.autoSlideInterval = setInterval(() => {
                if (this.isAutoSliding) {
                    this.nextSlide();
                }
            }, 5000);
        }
    }
    
    /**
     * Pause auto-slide
     */
    pauseAutoSlide() {
        this.isAutoSliding = false;
    }
    
    /**
     * Resume auto-slide
     */
    resumeAutoSlide() {
        this.isAutoSliding = true;
    }
    
    /**
     * Reset auto-slide timer
     */
    resetAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.startAutoSlide();
        }
    }
    
    /**
     * Stop auto-slide completely
     */
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
        this.isAutoSliding = false;
    }
}

/**
 * ===== 7. NAVIGATION HANDLERS =====
 * Handle navigation and routing
 */
class NavigationManager {
    constructor(domManager, searchManager) {
        this.dom = domManager;
        this.search = searchManager;
    }
    
    /**
     * Initialize navigation functionality
     */
    init() {
        // Home link
        if (this.dom.homeLink) {
            this.dom.homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.goHome();
            });
        }
        
        // Book links in carousel
        this.dom.bookLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleBookClick(link);
            });
        });
    }
    
    /**
     * Handle home navigation
     */
    goHome() {
        this.search.clearSearch();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Track analytics
        analytics.trackNavigation('home');
    }
    
    /**
     * Handle book link clicks
     * @param {Element} link - Clicked book link
     */
    handleBookClick(link) {
        const url = link.getAttribute('data-link');
        const bookTitle = link.closest('.carousel-caption')?.querySelector('h3')?.textContent || 'Unknown';
        
        if (url) {
            // Track click
            analytics.trackBookClick(bookTitle, 'carousel');
            
            // Open link
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
}

/**
 * ===== 8. UTILITY FUNCTIONS =====
 * Helper functions and utilities
 */
class UtilityManager {
    /**
     * Debounce function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    /**
     * Throttle function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Check if element is in viewport
     * @param {Element} element - Element to check
     * @returns {boolean} True if in viewport
     */
    static isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    static generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}

/**
 * ===== 9. ANALYTICS & TRACKING =====
 * Simple analytics for user interaction tracking
 */
class AnalyticsManager {
    constructor() {
        this.events = [];
        this.sessionId = UtilityManager.generateId();
        this.startTime = Date.now();
    }
    
    /**
     * Track book click event
     * @param {string} title - Book title
     * @param {string} source - Source of click
     */
    trackBookClick(title, source) {
        this.trackEvent('book_click', {
            book_title: title,
            source: source,
            timestamp: Date.now()
        });
    }
    
    /**
     * Track category filter
     * @param {string} category - Selected category
     */
    trackCategoryFilter(category) {
        this.trackEvent('category_filter', {
            category: category,
            timestamp: Date.now()
        });
    }
    
    /**
     * Track theme change
     * @param {string} theme - New theme
     */
    trackThemeChange(theme) {
        this.trackEvent('theme_change', {
            theme: theme,
            timestamp: Date.now()
        });
    }
    
    /**
     * Track navigation
     * @param {string} destination - Navigation destination
     */
    trackNavigation(destination) {
        this.trackEvent('navigation', {
            destination: destination,
            timestamp: Date.now()
        });
    }
    
    /**
     * Track generic event
     * @param {string} eventName - Event name
     * @param {Object} data - Event data
     */
    trackEvent(eventName, data) {
        const event = {
            event: eventName,
            session_id: this.sessionId,
            ...data
        };
        
        this.events.push(event);
        
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Analytics Event:', event);
        }
    }
    
    /**
     * Get session summary
     * @returns {Object} Session summary
     */
    getSessionSummary() {
        return {
            session_id: this.sessionId,
            duration: Date.now() - this.startTime,
            events_count: this.events.length,
            events: this.events
        };
    }
}

/**
 * ===== 10. MAIN APPLICATION =====
 * Main application controller
 */
class LangitPustakaApp {
    constructor() {
        this.dom = null;
        this.search = null;
        this.category = null;
        this.theme = null;
        this.carousel = null;
        this.navigation = null;
        this.analytics = null;
    }
    
    /**
     * Initialize the application
     */
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    /**
     * Set up all application components
     */
    setup() {
        try {
            // Initialize managers
            this.dom = new DOMManager();
            this.analytics = new AnalyticsManager();
            this.search = new SearchManager(this.dom);
            this.category = new CategoryManager(this.dom, this.search);
            this.theme = new ThemeManager(this.dom);
            this.carousel = new CarouselManager(this.dom);
            this.navigation = new NavigationManager(this.dom, this.search);
            
            // Initialize all components
            this.search.init();
            this.category.init();
            this.theme.init();
            this.carousel.init();
            this.navigation.init();
            
            // Set up global error handling
            this.setupErrorHandling();
            
            // Set up visibility change handling
            this.setupVisibilityHandling();
            
            // Make analytics globally available
            window.analytics = this.analytics;
            
            console.log('Langit Pustaka App initialized successfully');
            
        } catch (error) {
            console.error('Error initializing Langit Pustaka App:', error);
        }
    }
    
    /**
     * Set up global error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.analytics.trackEvent('error', {
                message: event.error.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.analytics.trackEvent('promise_rejection', {
                reason: event.reason
            });
        });
    }
    
    /**
     * Set up visibility change handling
     */
    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Pause carousel when tab is not visible
                if (this.carousel) {
                    this.carousel.pauseAutoSlide();
                }
            } else {
                // Resume carousel when tab becomes visible
                if (this.carousel) {
                    this.carousel.resumeAutoSlide();
                }
            }
        });
    }
}

/**
 * ===== APPLICATION INITIALIZATION =====
 * Initialize the application
 */
const app = new LangitPustakaApp();
app.init();

/**
 * ===== EXPORT FOR TESTING =====
 * Export components for testing purposes
 */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        bookData,
        DOMManager,
        SearchManager,
        CategoryManager,
        ThemeManager,
        CarouselManager,
        NavigationManager,
        UtilityManager,
        AnalyticsManager,
        LangitPustakaApp // <- Tambahkan kelas utama agar bisa diuji
    };
}