/**
 * Automatech - Main JavaScript
 * Handles all interactivity for the landing page
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initLucideIcons();
    initNavbar();
    initMobileMenu();
    initScrollAnimations();
    initFAQAccordion();
    initContactForm();
    initResponsiveGrid();
    initParticles();
});

/**
 * Handle responsive grid for services section
 */
function initResponsiveGrid() {
    const grids = document.querySelectorAll('[data-responsive-grid]');
    if (!grids.length) return;
    
    grids.forEach(grid => {
        const breakpoint = grid.getAttribute('data-responsive-grid');
        const [bp, cols] = breakpoint ? breakpoint.split(':') : ['md', '3'];
        const breakpointPx = bp === 'md' ? 768 : bp === 'lg' ? 1024 : 640;
        
        function updateGrid() {
            if (window.innerWidth >= breakpointPx) {
                grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
            } else {
                grid.style.gridTemplateColumns = 'repeat(1, 1fr)';
            }
        }
        
        updateGrid();
        window.addEventListener('resize', debounce(updateGrid, 150));
    });
}

/**
 * Initialize Lucide Icons
 */
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Navbar scroll effect
 * Adds background blur and border when scrolled
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    };
    
    // Initial check
    handleScroll();
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (!menuBtn || !mobileMenu) return;
    
    menuBtn.addEventListener('click', () => {
        const isOpen = !mobileMenu.classList.contains('hidden');
        
        if (isOpen) {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
        } else {
            mobileMenu.classList.remove('hidden');
            menuBtn.innerHTML = '<i data-lucide="x" class="w-6 h-6"></i>';
        }
        
        // Re-initialize icons after changing innerHTML
        lucide.createIcons();
    });
    
    // Close menu when clicking on a link
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            menuBtn.innerHTML = '<i data-lucide="menu" class="w-6 h-6"></i>';
            lucide.createIcons();
        });
    });
}

/**
 * Scroll-triggered animations using Intersection Observer
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Get delay from style attribute if present
                const delay = entry.target.style.animationDelay || '0s';
                const delayMs = parseFloat(delay) * 1000;
                
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delayMs);
                
                // Unobserve after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => observer.observe(el));
}

/**
 * FAQ Accordion functionality
 */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        
        if (!trigger || !content) return;
        
        trigger.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherContent) {
                        otherContent.classList.add('hidden');
                    }
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
                content.classList.add('hidden');
            } else {
                item.classList.add('active');
                content.classList.remove('hidden');
            }
        });
    });
}

/**
 * Contact Form handling with validation
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        
        // Validate form
        if (!validateForm(form)) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;
        
        // Submit form to backend
        try {
            await submitContactForm(form);
            
            // Show success message
            if (successMessage) {
                successMessage.classList.remove('hidden');
                lucide.createIcons(); // Re-render icons in success message
            }
            
            // Reset form
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                if (successMessage) {
                    successMessage.classList.add('hidden');
                }
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
        } finally {
            // Reset button
            submitBtn.classList.remove('loading');
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
            lucide.createIcons();
        }
    });
    
    // Real-time validation on blur
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });
        
        // Clear error on focus
        input.addEventListener('focus', () => {
            clearInputError(input);
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * Validate single input
 */
function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required check
    if (input.required && !value) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    }
    
    // Email validation
    if (input.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un email válido';
        }
    }
    
    // Phone validation (optional but if filled, validate format)
    if (input.type === 'tel' && value) {
        const phoneRegex = /^[\d\s+()-]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Por favor, introduce un teléfono válido';
        }
    }
    
    // Show/hide error
    if (!isValid) {
        showInputError(input, errorMessage);
    } else {
        clearInputError(input);
    }
    
    return isValid;
}

/**
 * Show input error
 */
function showInputError(input, message) {
    // Remove existing error
    clearInputError(input);
    
    // Add error styles
    input.classList.add('border-red-500');
    input.classList.remove('border-dark-600');
    
    // Create error message element
    const errorEl = document.createElement('p');
    errorEl.className = 'text-red-400 text-sm mt-1 input-error';
    errorEl.textContent = message;
    
    // Insert after input
    input.parentNode.appendChild(errorEl);
}

/**
 * Clear input error
 */
function clearInputError(input) {
    input.classList.remove('border-red-500');
    input.classList.add('border-dark-600');
    
    const errorEl = input.parentNode.querySelector('.input-error');
    if (errorEl) {
        errorEl.remove();
    }
}

/**
 * Submit contact form to /api/contact
 */
async function submitContactForm(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: String(data.name || ''),
            email: String(data.email || ''),
            phone: String(data.phone || ''),
            message: String(data.message || ''),
            // Honeypot (should be empty)
            company: String(data.company || '')
        })
    });
    
    const json = await resp.json().catch(() => ({}));
    
    if (!resp.ok || !json || json.ok !== true) {
        throw new Error((json && json.error) ? json.error : 'Request failed');
    }
    
    return json;
}

/**
 * Smooth scroll to section (fallback for older browsers)
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Debounce utility function
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

/**
 * Throttle utility function
 */
function throttle(func, limit) {
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
 * Initialize Particles.js for Hero background
 */
function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#64748b'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#94a3b8',
                opacity: 0.3,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.6
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
}
