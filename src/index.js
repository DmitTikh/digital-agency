
const loader = document.getElementById('loader-wrapper');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');

window.addEventListener('load', () => {
  if(loader) {
    loader.remove();
  }
});

if(mobileMenuTrigger) {
  mobileMenuTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.add('opened', 'lock');
  });
}

if(mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener('click', () => {
    document.body.classList.remove('opened', 'lock');
  });
}

if(mobileMenuClose) {
  mobileMenuClose.addEventListener('click', () => {
    document.body.classList.remove('opened', 'lock');
  });
}