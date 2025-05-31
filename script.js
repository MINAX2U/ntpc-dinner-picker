// ================ FIXED SCRIPT.JS ================ 
// Highlight active page
document.addEventListener('DOMContentLoaded', highlightActiveLink);

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Initialize page components
function initializePage() {
    //Mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!hamburger?.contains(e.target) && !navLinks?.contains(e.target)) {
            navLinks?.classList.remove('active');
        }
    });
}

// SPA navigation handler
async function handleNavigation(e) {
    e.preventDefault();
    const url = this.href;
    const loadingOverlay = createLoadingOverlay();
    
    try {
        document.body.appendChild(loadingOverlay);
        const response = await fetch(url);
        const text = await response.text();
        const newDoc = new DOMParser().parseFromString(text, 'text/html');

        // Fade out old content
        document.querySelector('main').classList.add('hidden');

        setTimeout(() => {
            // Replace content
            document.querySelector('main').replaceWith(newDoc.querySelector('main'));
            document.querySelector('.nav-links').replaceWith(newDoc.querySelector('.nav-links'));
            
            // Reinitialize everything
            highlightActiveLink();
            initializePage();
            window.scrollTo(0, 0);
            
            // Fade in new content
            loadingOverlay.remove();
            setTimeout(() => {
                document.querySelector('main').classList.remove('hidden');
            }, 50);
        }, 300);

        window.history.pushState(null, null, url);
    } catch (error) {
        console.error('Navigation failed:', error);
        window.location = url;
    }
}

// Helper functions
function highlightActiveLink() {
    const currentPage = location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === currentPage);
    });
}

function createLoadingOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.innerHTML = '<div class="loading-spinner"></div>';
    return overlay;
}

// Initial load
document.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('popstate', () => location.reload());