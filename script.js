// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 30, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 15, 30, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll(
    '.problem-card, .feature-card, .comparison-card, .audience-card, .solution-content'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// Waitlist form submission
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('emailInput');
const userType = document.getElementById('userType');
const waitlistCount = document.getElementById('waitlistCount');

waitlistForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    const type = userType.value;
    
    if (!email || !type) {
        alert('모든 필드를 입력해주세요.');
        return;
    }
    
    // Simulate form submission
    const btn = waitlistForm.querySelector('.btn-waitlist');
    const originalText = btn.textContent;
    btn.textContent = '신청 중...';
    btn.disabled = true;
    
    setTimeout(() => {
        btn.textContent = '✓ 신청 완료!';
        btn.style.background = 'linear-gradient(135deg, #00B894 0%, #00CEC9 100%)';
        
        // Update waitlist count
        const currentCount = parseInt(waitlistCount.textContent.replace(/,/g, ''));
        waitlistCount.textContent = (currentCount + 1).toLocaleString();
        
        // Reset form
        emailInput.value = '';
        userType.value = '';
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = '사전 신청이 완료되었습니다! 출시 소식을 이메일로 보내드리겠습니다.';
        successMessage.style.cssText = `
            background: linear-gradient(135deg, #00B894 0%, #00CEC9 100%);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            margin-top: 20px;
            text-align: center;
            animation: fadeInUp 0.5s ease-out;
        `;
        waitlistForm.parentElement.appendChild(successMessage);
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.background = 'var(--gradient-1)';
            successMessage.remove();
        }, 3000);
    }, 1500);
});

// Counter animation for stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
};

// Observe hero stats for counter animation
const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const text = stat.textContent;
                if (text.includes('K')) {
                    const num = parseInt(text.replace('K+', '')) * 1000;
                    setTimeout(() => {
                        stat.textContent = '0';
                        animateCounter(stat, num, 2000);
                        setTimeout(() => {
                            stat.textContent = text;
                        }, 2000);
                    }, index * 200);
                } else if (text.includes('M')) {
                    const num = parseInt(text.replace('M+', '')) * 1000000;
                    setTimeout(() => {
                        stat.textContent = '0';
                        animateCounter(stat, num, 2000);
                        setTimeout(() => {
                            stat.textContent = text;
                        }, 2000);
                    }, index * 200);
                }
            });
            heroStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    heroStatsObserver.observe(heroStats);
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Dynamic waitlist count update (simulate real-time updates)
let baseCount = 2847;
setInterval(() => {
    if (Math.random() > 0.7) { // 30% chance every 5 seconds
        baseCount += Math.floor(Math.random() * 3) + 1;
        waitlistCount.textContent = baseCount.toLocaleString();
    }
}, 5000);

// Add hover effect to feature cards
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add interactive gradient effect to logo
const logo = document.querySelector('.logo');
let hue = 0;
setInterval(() => {
    hue = (hue + 1) % 360;
    logo.style.filter = `hue-rotate(${hue}deg)`;
}, 50);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

window.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiSequence.join(',')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 5000);
    }
});

// Add CSS for rainbow animation
const style = document.createElement('style');
style.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(style);

console.log('🎵 FAN:STAGE - 팬이 만드는 음악 생태계');
console.log('Made with ♥ by FAN:STAGE Team');
