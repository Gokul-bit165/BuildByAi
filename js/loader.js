window.addEventListener('load', () => {
  let count = 0;
  const counter = document.getElementById('loaderCount');
  const fill = document.getElementById('loaderFill');
  
  // Simulated progress for the first 80%
  const progressInterval = setInterval(() => {
    if (count < 85) {
      count += Math.floor(Math.random() * 5) + 1;
      updateLoader(count);
    } else {
      clearInterval(progressInterval);
      // Finish to 100 on load
      updateLoader(100);
      setTimeout(revealPage, 500);
    }
  }, 100);

  function updateLoader(val) {
    if (counter) counter.textContent = Math.min(100, val);
    if (fill) fill.style.width = Math.min(100, val) + '%';
  }

  function revealPage() {
    const tl = gsap.timeline({
      onComplete: () => {
        document.getElementById('loader').style.display = 'none';
        ScrollTrigger.refresh();
      }
    });
    
    tl.to('#loader', {
      yPercent: -100,
      duration: 1.2,
      ease: 'expo.inOut'
    });
  }
});
