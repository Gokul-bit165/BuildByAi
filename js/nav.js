document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');
  const burger = document.querySelector('.burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  // SCROLL EFFECTS
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.backdropFilter = 'blur(20px)';
      nav.style.borderBottom = '1px solid rgba(240,237,230,0.06)';
      nav.style.background = 'rgba(5,5,7,0.85)';
      nav.style.padding = '1rem 4rem';
    } else {
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = 'none';
      nav.style.background = 'transparent';
      nav.style.padding = '1.5rem 4rem';
    }
  }, { passive: true });

  // ACTIVE LINK HIGHLIGHT
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0% -70% 0%',
    threshold: 0
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // MOBILE MENU (If exists)
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      const isOpen = burger.classList.contains('open');
      gsap.to(mobileMenu, {
        clipPath: isOpen ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
        duration: 0.6,
        ease: 'power4.inOut'
      });
    });
  }
});
