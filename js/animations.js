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
 
 // Force scroll to top on refresh
 if ('scrollRestoration' in history) {
   history.scrollRestoration = 'manual';
 }
 window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  // 1. SPLINE ZOOM & PARALLAX ENTRANCE
  const splineWrapper = document.querySelector('.spline-wrapper');
  if (splineWrapper) {
    // Entrance zoom
    gsap.from(splineWrapper, {
      scale: 1.3,
      duration: 2.5,
      ease: 'power2.out',
      delay: 0.5
    });

    // Scroll parallax enhancement (Subtle scale instead of movement to avoid revealing background)
    gsap.to(splineWrapper, {
      scale: 1.25,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  }

  // 2. ANTI-GRAVITY FLOATING CHIPS
  const chips = document.querySelectorAll('.float-chip');
  const chipContainer = document.querySelector('.chip-container');
  
  const chipData = Array.from(chips).map(chip => {
    // Scatter around edges
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x, y;
    if (side === 0) { x = Math.random() * 100; y = Math.random() * 20; }
    else if (side === 1) { x = 80 + Math.random() * 20; y = Math.random() * 100; }
    else if (side === 2) { x = Math.random() * 100; y = 80 + Math.random() * 20; }
    else { x = Math.random() * 20; y = Math.random() * 100; }

    chip.style.left = `${x}%`;
    chip.style.top = `${y}%`;

    return {
      el: chip,
      baseX: x,
      baseY: y,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      parallax: parseFloat(chip.dataset.parallax) || 0.08,
      floatDuration: 4 + Math.random() * 3,
      floatOffset: 12
    };
  });

  // Idle float animation
  chipData.forEach(data => {
    gsap.to(data.el, {
      y: `-=${data.floatOffset}px`,
      duration: data.floatDuration,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });

  // Mouse repulsion and parallax
  let mouseX = 0, mouseY = 0;
  let lastMouseX = 0, lastMouseY = 0;
  let mouseVel = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Velocity calculation for spotlight
    const dx = mouseX - lastMouseX;
    const dy = mouseY - lastMouseY;
    const dist = Math.sqrt(dx*dx + dy*dy);
    mouseVel = Math.min(dist / 50, 0.15); // Max 0.15 opacity
    
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  });

  const updateChips = () => {
    const scrollY = window.pageYOffset;

    chipData.forEach(data => {
      const rect = data.el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const dist = Math.sqrt(dx*dx + dy*dy);

      let forceX = 0;
      let forceY = 0;

      if (dist < 180) {
        const angle = Math.atan2(dy, dx);
        const power = (1 - dist / 180) * 70;
        forceX = -Math.cos(angle) * power;
        forceY = -Math.sin(angle) * power;
      }

      // Parallax
      const parallaxY = scrollY * data.parallax;

      // Lerp
      data.targetX = forceX;
      data.targetY = forceY - parallaxY;

      data.x += (data.targetX - data.x) * 0.08;
      data.y += (data.targetY - data.y) * 0.08;

      data.el.style.transform = `translate(${data.x}px, ${data.y}px)`;
    });

    // Spotlight update
    const spotlight = document.querySelector('.spotlight');
    if (spotlight) {
      gsap.to(spotlight, {
        opacity: Math.max(0.05, mouseVel), // subtle base opacity
        background: `radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(184,255,87,0.08), transparent 70%)`,
        duration: 0.3
      });
    }

    requestAnimationFrame(updateChips);
  };
  updateChips();

  // 4. VIDEO SCRUBBING
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

  // 5. PARALLAX LAYERS
  gsap.utils.toArray('.parallax-layer').forEach(layer => {
    const speed = layer.dataset.speed || 0.1;
    gsap.to(layer, {
      yPercent: -20 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true,
      }
    });
  });

  // 6. SVG LINE DRAW
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

  // 7. IMAGE CLIP REVEAL
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
