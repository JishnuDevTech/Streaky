/* ================================
   MOBILE / RESPONSIVE FIX JS
   ================================ */

/* ---- SAFE VIEWPORT HEIGHT FIX (iOS / Android) ---- */
function setSafeVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setSafeVH();
window.addEventListener('resize', setSafeVH);
window.addEventListener('orientationchange', setSafeVH);

/* ---- SCREEN SWITCH (NO SCROLL JUMP) ---- */
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        target.scrollTop = 0;
    }
}

/* ---- LOCK BODY SCROLL ONLY FOR MODALS ---- */
function lockBodyScroll() {
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
}

function unlockBodyScroll() {
    document.body.style.position = '';
    document.body.style.width = '';
}

/* ---- MODAL HANDLING (MOBILE SAFE) ---- */
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    lockBodyScroll();
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    unlockBodyScroll();
}

/* ---- AUTO FIX INPUT FOCUS SCROLL ---- */
document.addEventListener('focusin', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        setTimeout(() => {
            e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
    }
});

/* ---- BACKDROP CLICK CLOSE ---- */
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const modal = overlay.closest('.modal');
        closeModal(modal);
    });
});

/* ---- ESC CLOSE (DESKTOP) ---- */
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal);
        });
    }
});

/* ---- PREVENT DOUBLE TAP ZOOM ---- */
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

/* ---- IOS SAFARI INPUT ZOOM FIX ---- */
document.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('focus', () => {
        document.body.classList.add('input-focus');
    });
    input.addEventListener('blur', () => {
        document.body.classList.remove('input-focus');
    });
});
