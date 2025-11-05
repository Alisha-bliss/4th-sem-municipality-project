// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('App initialized'); // Debug log
    
    // DOM Elements
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeLogin = document.getElementById('closeLogin');
    const closeRegister = document.getElementById('closeRegister');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');

    // Debug: Check if elements exist
    console.log('Login button:', loginBtn);
    console.log('Register button:', registerBtn);

    // Show login modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Login button clicked');
            if (loginModal) {
                loginModal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        });
    } else {
        console.error('Login button not found');
    }

    // Show register modal
    if (registerBtn) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Register button clicked');
            if (registerModal) {
                registerModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    } else {
        console.error('Register button not found');
    }

    // Switch to register form
    if (showRegister) {
        showRegister.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Show register clicked');
            if (loginModal && registerModal) {
                loginModal.style.display = 'none';
                registerModal.style.display = 'flex';
            }
        });
    }

    // Switch to login form
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Show login clicked');
            if (registerModal && loginModal) {
                registerModal.style.display = 'none';
                loginModal.style.display = 'flex';
            }
        });
    }

    // Close modals
    if (closeLogin) {
        closeLogin.addEventListener('click', function() {
            console.log('Close login clicked');
            if (loginModal) {
                loginModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    if (closeRegister) {
        closeRegister.addEventListener('click', function() {
            console.log('Close register clicked');
            if (registerModal) {
                registerModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            console.log('Clicked outside login modal');
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        if (e.target === registerModal) {
            console.log('Clicked outside register modal');
            registerModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    console.log('All event listeners attached');
});