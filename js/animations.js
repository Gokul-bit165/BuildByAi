// LENIS SMOOTH SCROLL
const lenis = new Lenis({
  duration: 1.4,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.8,
});

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. HERO SPLIT TEXT
  const heroHeadlines = document.querySelectorAll('.hero-headline div');
  heroHeadlines.forEach(line => {
    const text = line.innerText;
    line.innerHTML = text.split('').map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
    gsap.from(line.querySelectorAll('.char'), {
      y: 120, opacity: 0, rotateX: -90, stagger: 0.02,
      duration: 1.2, ease: 'power4.out', delay: 0.8
    });
  });

  // 2. HERO 3D MOUSE EFFECTS
  const hero = document.querySelector('.hero');
  const tiltHeadline = document.querySelector('.tilt-hero');
  const brainAsset = document.querySelector('.hero-brain-asset');

  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth) - 0.5;
      const yPos = (clientY / window.innerHeight) - 0.5;

      if (tiltHeadline) {
        gsap.to(tiltHeadline, {
          rotateY: xPos * 20,
          rotateX: -yPos * 20,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      if (brainAsset) {
        gsap.to(brainAsset, {
          x: xPos * 50,
          y: yPos * 50,
          duration: 0.8,
          ease: 'power2.out'
        });
      }
    });
  }

  // 3. VIDEO SCRUBBING
  const video = document.getElementById('scrubVideo');
  if (video) {
    const initVideoScrub = () => {
      gsap.to(video, {
        currentTime: video.duration,
        ease: 'none',
        scrollTrigger: {
          trigger: '.video-scrub-section',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          pin: '.scrub-sticky',
          onUpdate: self => {
            const p = self.progress;
            const fill = document.getElementById('scrubFill');
            if (fill) fill.style.width = (p * 100) + '%';
            
            const steps = document.querySelectorAll('.scrub-step');
            const index = p < 0.33 ? 0 : (p < 0.66 ? 1 : 2);
            steps.forEach((s, i) => {
              s.classList.toggle('active', i === index);
            });
          }
        }
      });
    };

    if (video.readyState >= 1) {
      initVideoScrub();
    } else {
      video.addEventListener('loadedmetadata', initVideoScrub);
    }
  }

  // 4. PARALLAX LAYERS
  gsap.utils.toArray('.parallax-layer').forEach(layer => {
    if (layer.classList.contains('hero-brain-asset')) return; // Handled by mouse parallax
    const speed = layer.dataset.speed || 0.1;
    gsap.to(layer, {
      yPercent: -20 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true,
      }
    });
  });

  // 5. SVG LINE DRAW
  const path = document.querySelector('.timeline-path');
  if (path) {
    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    gsap.to(path, {
      strokeDashoffset: 0, ease: 'none',
      scrollTrigger: {
        trigger: '.process-section', start: 'top 60%', end: 'bottom 80%', scrub: 1,
      }
    });
  }

  // 6. IMAGE CLIP REVEAL
  gsap.utils.toArray('.project-card').forEach(card => {
    const img = card.querySelector('.project-img');
    if (img) {
      gsap.set(img, { scale: 1.2 });
      gsap.timeline({
        scrollTrigger: {
          trigger: card, start: 'top 85%', end: 'top 40%', scrub: 0.6,
        }
      })
      .from(card, { clipPath: 'inset(100% 0% 0% 0%)', ease: 'power2.out' })
      .to(img, { scale: 1, ease: 'power2.out' }, 0);
    }
  });

  // 7. FOOTER REVEAL
  gsap.from('.footer-big-text', {
    letterSpacing: '0.01em', y: 100, opacity: 0,
    scrollTrigger: {
      trigger: '.footer-big-text', start: 'top 95%', end: 'top 60%', scrub: 1,
    }
  });

  // 8. COUNTERS
  gsap.utils.toArray('.stat-num').forEach(el => {
    const target = parseInt(el.innerText);
    gsap.from({ val: 0 }, {
      val: target, duration: 2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%' },
      onUpdate: function() {
        el.textContent = Math.round(this.targets()[0].val);
      }
    });
  });
});
