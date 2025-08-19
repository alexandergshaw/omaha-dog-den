/**
 * Main JavaScript for Omaha Dog Den website
 * Handles site functionality with accessibility in mind
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeFormValidation();
    initializeSmoothScrolling();
    initializeKeyboardNavigation();
    initializeAnimations();
    initializeFocusManagement();
    
    console.log('Omaha Dog Den website initialized');
});

/**
 * Navigation functionality
 */
function initializeNavigation() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    if (!menuToggle || !navMenu) return;
    
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        const newState = !isExpanded;
        
        menuToggle.setAttribute('aria-expanded', newState);
        navMenu.classList.toggle('active', newState);
        
        // Focus management
        if (newState) {
            // Focus first menu item when menu opens
            const firstLink = navMenu.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }
        
        // Update hamburger animation
        updateHamburgerAnimation(newState);
    });
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                updateHamburgerAnimation(false);
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            if (navMenu.classList.contains('active')) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                updateHamburgerAnimation(false);
            }
        }
    });
    
    // Keyboard navigation for menu
    navMenu.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            updateHamburgerAnimation(false);
            menuToggle.focus();
        }
    });
}

function updateHamburgerAnimation(isActive) {
    const hamburgers = document.querySelectorAll('.hamburger');
    hamburgers.forEach((line, index) => {
        if (isActive) {
            if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) line.style.opacity = '0';
            if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            line.style.transform = '';
            line.style.opacity = '';
        }
    });
}

/**
 * Form validation with accessibility features
 */
function initializeFormValidation() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    
    const requiredFields = form.querySelectorAll('[required]');
    const submitButton = form.querySelector('.submit-button');
    
    // Real-time validation
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(field);
        });
        
        field.addEventListener('input', function() {
            // Clear errors when user starts typing
            clearFieldError(field);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        let isValid = true;
        const errors = [];
        
        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                errors.push(field);
            }
        });
        
        if (isValid) {
            handleFormSubmission(form);
        } else {
            // Focus first error field
            if (errors.length > 0) {
                errors[0].focus();
            }
            
            // Announce errors to screen readers
            announceFormErrors(errors.length);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(field)} is required.`;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    // Phone validation
    if (fieldType === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Update field state
    field.setAttribute('aria-invalid', !isValid);
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function getFieldLabel(field) {
    const label = document.querySelector(`label[for="${field.id}"]`);
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    return field.name;
}

function showFieldError(field, message) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.setAttribute('aria-describedby', errorId);
    }
    
    // Add error styling
    field.classList.add('error');
}

function clearFieldError(field) {
    const errorId = field.id + '-error';
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        field.removeAttribute('aria-describedby');
    }
    
    // Remove error styling
    field.classList.remove('error');
}

function announceFormErrors(errorCount) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'visually-hidden';
    announcement.textContent = `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and correct.`;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

function handleFormSubmission(form) {
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    // Update button state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Success state
        submitButton.textContent = 'Message Sent!';
        submitButton.className = 'submit-button success';
        
        // Announce success
        const successMessage = document.createElement('div');
        successMessage.setAttribute('aria-live', 'polite');
        successMessage.className = 'visually-hidden';
        successMessage.textContent = 'Your message has been sent successfully. We\'ll respond within 24 hours.';
        document.body.appendChild(successMessage);
        
        // Reset form
        setTimeout(() => {
            form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.removeAttribute('aria-busy');
            submitButton.className = 'submit-button';
            document.body.removeChild(successMessage);
        }, 3000);
        
    }, 2000);
}

/**
 * Smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                event.preventDefault();
                
                // Scroll to target with offset for fixed header
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Focus target element for screen readers
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus();
                
                // Announce navigation to screen readers
                announceNavigation(targetElement);
            }
        });
    });
}

function announceNavigation(targetElement) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'visually-hidden';
    
    const heading = targetElement.querySelector('h1, h2, h3, h4, h5, h6');
    const sectionName = heading ? heading.textContent : 'section';
    
    announcement.textContent = `Navigated to ${sectionName}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

/**
 * Enhanced keyboard navigation
 */
function initializeKeyboardNavigation() {
    // Skip links
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(event) {
            event.preventDefault();
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.setAttribute('tabindex', '-1');
                mainContent.focus();
            }
        });
    }
    
    // Arrow key navigation for menus
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        navMenu.addEventListener('keydown', function(event) {
            const menuItems = Array.from(navMenu.querySelectorAll('a'));
            const currentIndex = menuItems.indexOf(document.activeElement);
            
            switch (event.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    event.preventDefault();
                    const nextIndex = (currentIndex + 1) % menuItems.length;
                    menuItems[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                case 'ArrowLeft':
                    event.preventDefault();
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
                    menuItems[prevIndex].focus();
                    break;
                    
                case 'Home':
                    event.preventDefault();
                    menuItems[0].focus();
                    break;
                    
                case 'End':
                    event.preventDefault();
                    menuItems[menuItems.length - 1].focus();
                    break;
            }
        });
    }
    
    // Focus trap for accessibility panel
    const accessibilityPanel = document.getElementById('accessibility-panel');
    if (accessibilityPanel) {
        accessibilityPanel.addEventListener('keydown', function(event) {
            if (event.key === 'Tab') {
                trapFocus(event, accessibilityPanel);
            }
        });
    }
}

function trapFocus(event, container) {
    const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (event.shiftKey) {
        if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        }
    } else {
        if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }
}

/**
 * Animations with respect for reduced motion preference
 */
function initializeAnimations() {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable or reduce animations
        document.documentElement.style.setProperty('--transition-fast', '0s');
        document.documentElement.style.setProperty('--transition-normal', '0s');
        document.documentElement.style.setProperty('--transition-slow', '0s');
        return;
    }
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Focus management utilities
 */
function initializeFocusManagement() {
    // Store focus when modals or panels open
    let lastFocusedElement = null;
    
    // Track focus for accessibility panel
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    
    if (accessibilityToggle && accessibilityPanel) {
        accessibilityToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                lastFocusedElement = document.activeElement;
                // Focus first focusable element in panel
                const firstFocusable = accessibilityPanel.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            } else {
                // Return focus to toggle button
                if (lastFocusedElement) {
                    lastFocusedElement.focus();
                    lastFocusedElement = null;
                }
            }
        });
        
        // Close panel with Escape key
        accessibilityPanel.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                accessibilityToggle.click();
            }
        });
    }
    
    // Manage focus for dynamic content
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure page has proper focus order
        const firstHeading = document.querySelector('h1');
        if (firstHeading) {
            firstHeading.setAttribute('tabindex', '-1');
        }
    });
}

/**
 * Utility functions
 */
function debounce(func, wait) {
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Resize handler with debouncing
window.addEventListener('resize', debounce(function() {
    // Handle responsive changes
    const navMenu = document.querySelector('.nav-menu');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (window.innerWidth > 768 && navMenu && menuToggle) {
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        updateHamburgerAnimation(false);
    }
}, 250));

// Handle print styles
window.addEventListener('beforeprint', function() {
    // Ensure accessibility panel is hidden when printing
    const accessibilityPanel = document.getElementById('accessibility-panel');
    if (accessibilityPanel && !accessibilityPanel.hasAttribute('hidden')) {
        accessibilityPanel.setAttribute('data-was-visible', 'true');
        accessibilityPanel.setAttribute('hidden', '');
    }
});

window.addEventListener('afterprint', function() {
    // Restore accessibility panel state after printing
    const accessibilityPanel = document.getElementById('accessibility-panel');
    if (accessibilityPanel && accessibilityPanel.hasAttribute('data-was-visible')) {
        accessibilityPanel.removeAttribute('hidden');
        accessibilityPanel.removeAttribute('data-was-visible');
    }
});

// Error handling
window.addEventListener('error', function(event) {
    console.error('JavaScript error:', event.error);
    
    // Announce errors to screen readers in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'assertive');
        announcement.className = 'visually-hidden';
        announcement.textContent = 'A JavaScript error occurred. Check the console for details.';
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 5000);
    }
});

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeFormValidation,
        initializeSmoothScrolling,
        initializeKeyboardNavigation,
        validateField,
        debounce,
        throttle
    };
}