/* ===============================
   MOBILE SCROLL & MODAL FIX
   =============================== */

(function () {
  // Fix viewport height for mobile browsers
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);

  // Force all auth screens to start at top
  function forceTop() {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Patch modal open behavior
  window.openModal = function (modal) {
    if (!modal) return;

    modal.classList.add('active');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = 'calc(var(--vh, 1vh) * 100)';
    modal.style.overflowY = 'auto';
    modal.style.webkitOverflowScrolling = 'touch';

    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';

    forceTop();
  };

  // Patch modal close behavior
  window.closeModal = function (modal) {
    if (!modal) return;

    modal.classList.remove('active');

    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';

    forceTop();
  };

  // Fix signup / forgot appearing below
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-screen]');
    if (!target) return;

    setTimeout(forceTop, 50);
  });

  // Safety: always reset scroll on page load
  window.addEventListener('load', forceTop);
})();
