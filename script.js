// Site-wide JS behaviors
(function () {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            hamburger.setAttribute('aria-expanded',
                hamburger.classList.contains('active'));
        });

        mobileOverlay.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            mobileOverlay.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                mobileOverlay.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll animations - fade in elements when they come into view
    const observerOptions = {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (!nav) return;
        nav.style.background = window.scrollY > 100 ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.95)';
    });

    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Contact form handling with Netlify Forms
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            const status = document.getElementById('form-status');
            const submitBtn = contactForm.querySelector('.cta-button');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            // Validation
            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                status.textContent = 'Please fill out all fields.';
                status.style.color = '#d9534f';
                return;
            }

            if (!emailRegex.test(email.value.trim())) {
                status.textContent = 'Please enter a valid email address.';
                status.style.color = '#d9534f';
                email.focus();
                return;
            }

            // Show loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            status.textContent = 'Sending...';
            status.style.color = '#667eea';

            try {
                // Submit to Netlify
                const formData = new FormData(contactForm);
                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                if (response.ok) {
                    status.textContent = 'Thanks — your message has been sent! We will contact you shortly.';
                    status.style.color = '#28a745';
                    setTimeout(() => {
                        contactForm.reset();
                        status.textContent = '';
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                status.textContent = 'Oops! Something went wrong. Please try again.';
                status.style.color = '#d9534f';
            } finally {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Lazy loading for images - native browser support
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    } else {
        // Fallback for older browsers
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // Projects removed — placeholder: no project rendering or modal logic
})(); 