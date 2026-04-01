// ====== DOM Elements ======
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const closeBtn = document.querySelector('.close-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu ul li a');
const counters = document.querySelectorAll('.counter');
const parallaxElements = document.querySelectorAll('.parallax-element');

// ====== Navbar Scroll Effect ======
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====== Mobile Menu Toggle ======
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('active');
});

closeBtn.addEventListener('click', () => {
    mobileMenu.classList.remove('active');
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// ====== Parallax Effect on Mouse Move ======
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1024) return; // Disable parallax on smaller screens for performance

    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Normalize coordinates based on screen center
    const x = (mouseX - window.innerWidth / 2);
    const y = (mouseY - window.innerHeight / 2);

    parallaxElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 10;
        
        let transformStr = "";
        
        if (el.classList.contains('dashboard-mockup')) {
            // Keep centered transformation for mockup base
            const xOffset = x * (speed / 1000);
            const yOffset = y * (speed / 1000);
            transformStr = `translate(calc(50% + ${xOffset}px), calc(-50% + ${yOffset}px))`;
        } else {
            const xOffset = x * (speed / 1000);
            const yOffset = y * (speed / 1000);
            transformStr = `translate(${xOffset}px, ${yOffset}px)`;
        }
        
        el.style.transform = transformStr;
    });
});

// ====== Intersection Observer for Scroll Animations ======
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Trigger counter animation when stats section is visible
            if (entry.target.classList.contains('stats-wrapper') || entry.target.closest('.stats')) {
                startCounters();
            }
            
            // Unobserve after animating once
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add animation classes to elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(el => {
    // Check for delay
    if (el.hasAttribute('data-aos-delay')) {
        const delay = el.getAttribute('data-aos-delay');
        el.style.transitionDelay = `${delay}ms`;
    }
    
    observer.observe(el);
});

// ====== Counter Animation ======
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const duration = 2000; // ms
        const increment = target / (duration / 16); // 60fps

        let current = 0;
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };
        updateCounter();
    });
}

// Swiper only init if the slider element exists
if (document.querySelector('.portfolio-slider')) {
    new Swiper('.portfolio-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });
}

// ====== Active Nav Link on Scroll ======
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ====== Form Submission — Send to WhatsApp ======
function submitForm() {
    const nameVal     = document.getElementById('name').value.trim();
    const emailVal    = document.getElementById('email').value.trim();
    const phoneVal    = document.getElementById('phone').value.trim();
    const businessVal = document.getElementById('business').value.trim();

    // Build a clean WhatsApp message
    const message =
`Hello CineryTM Media! 👋

I'd like to get a *Free Proposal*. Here are my details:

👤 *Name:* ${nameVal}
📧 *Email:* ${emailVal}
📞 *Phone:* ${phoneVal}
🏢 *Business:* ${businessVal || 'Not specified'}

Please get in touch with me. Thank you!`;

    const whatsappNumber = '917842764522';
    const encodedMsg = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMsg}`;

    // Brief button animation before redirect
    const btn = document.querySelector('.contact-form button[type="submit"]');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';
    btn.disabled = true;

    setTimeout(() => {
        window.open(whatsappURL, '_blank');
        btn.innerHTML = '<i class="fas fa-check"></i> Sent to WhatsApp!';
        btn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            document.querySelector('.contact-form').reset();
        }, 3000);
    }, 800);
}
