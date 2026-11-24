document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Current Year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Scroll Reveal Observer
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-visible'));
    }

    // Animated Counters
    const counters = document.querySelectorAll('.counter-num');
    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target') || '0', 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 1400;
        const startTime = performance.now();

        const update = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentVal = Math.floor(eased * target);
            el.textContent = currentVal.toLocaleString() + suffix;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target.toLocaleString() + suffix;
            }
        };
        requestAnimationFrame(update);
    };

    if ('IntersectionObserver' in window && counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });
        counters.forEach(c => counterObserver.observe(c));
    }

    // Dynamic Services Filter (All Services Section)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-dir-card');
    if (filterButtons.length > 0 && serviceCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                serviceCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Quick-select service from any "Request Appointment" button
    document.querySelectorAll('[data-select-service]').forEach(btn => {
        btn.addEventListener('click', () => {
            const svc = btn.getAttribute('data-select-service');
            const selectEl = document.getElementById('serviceSelect');
            if (selectEl && svc) {
                for (let i = 0; i < selectEl.options.length; i++) {
                    if (selectEl.options[i].value === svc) {
                        selectEl.selectedIndex = i;
                        break;
                    }
                }
            }
        });
    });

    // WhatsApp Appointment Booking Form
    const bookingForm = document.getElementById('whatsapp-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('patientName').value.trim();
            const phone = document.getElementById('patientPhone').value.trim();
            const branch = document.getElementById('branchSelect').value;
            const service = document.getElementById('serviceSelect').value;
            const prefDate = document.getElementById('preferredDate').value.trim();

            const branchNumbers = {
                'Kokapet Branch': '919848000001',
                'LB Nagar Branch': '919848000002'
            };

            const targetPhone = branchNumbers[branch] || '919848000001';

            let message = `Hello Amma Eye Care Hospital, I would like to book an appointment.%0A%0A`;
            message += `*Patient Name:* ${encodeURIComponent(name)}%0A`;
            message += `*Phone:* ${encodeURIComponent(phone)}%0A`;
            message += `*Branch:* ${encodeURIComponent(branch)}%0A`;
            message += `*Service:* ${encodeURIComponent(service)}%0A`;
            if (prefDate) {
                message += `*Preferred Time:* ${encodeURIComponent(prefDate)}%0A`;
            }

            const whatsappUrl = `https://wa.me/${targetPhone}?text=${message}`;
            window.open(whatsappUrl, '_blank', 'noopener');
        });
    }
});
