document.addEventListener('DOMContentLoaded', () => {
  let count = 0;
  const counter = document.getElementById('loaderCount');
  const fill = document.getElementById('loaderFill');
  
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 8) + 2;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      revealPage();
    }
    if (counter) counter.textContent = count;
    if (fill) fill.style.width = count + '%';
  }, 40);

  function revealPage() {
    const tl = gsap.timeline();
    
    tl.to('#loader', {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut',
      delay: 0.3
    });
    
    tl.from('.hero-content', {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'power4.out'
    }, '-=0.6');

    // Reveal hero brain visual
    tl.to('.hero-brain-asset', {
      opacity: 0.7,
      scale: 1,
      duration: 2,
      ease: 'power2.out'
    }, '-=1.5');
  }
});
