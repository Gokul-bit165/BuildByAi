// LENIS SMOOTH SCROLL OPTIMIZATION
const lenis = new Lenis({
  lerp: 0.1, // Increased from 0.06 for faster, more responsive scrolling
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  normalizeWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(500, 33); // Prevent jumps on frame drops

 // Force scroll to top on refresh
 window.onbeforeunload = function() { window.scrollTo(0, 0); };
 if ('scrollRestoration' in history) {
   history.scrollRestoration = 'manual';
 }

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

    // Scroll Pinning & Parallax enhancement
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top top',
      end: '+=100%', // Scroll for 100% of viewport height while pinned
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        // Optional: manual zoom enhancement during pin
        gsap.set(splineWrapper, { scale: 1.15 + (self.progress * 0.1) });
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

  // 9. HANDS CREATION ANIMATION (Cinematic & Balanced)
  // Part A: Entry Movement (Starts as you scroll towards the section)
  gsap.set('#leftHand', { x: '-80vw', y: '-50%', opacity: 0.3 });
  gsap.set('#rightHand', { x: '80vw', y: '-50%', opacity: 0.3 });

  gsap.to('#leftHand', {
    x: '-35vw',
    opacity: 0.6,
    ease: 'none', // Added linear ease
    scrollTrigger: {
      trigger: '#handsSection',
      start: 'top bottom',
      end: 'top top',
      scrub: 0.5,
    }
  });

  gsap.to('#rightHand', {
    x: '25vw',
    opacity: 0.6,
    ease: 'none', // Added linear ease
    scrollTrigger: {
      trigger: '#handsSection',
      start: 'top bottom',
      end: 'top top',
      scrub: 0.5,
    }
  });

  // Part B: The Pinned Touch Moment
  const handsTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#handsSection',
      start: 'top top',
      end: '+=80%', // Slightly decreased for quicker overall completion
      pin: true,
      scrub: 0.5,
    }
  });

  handsTl
    // Phase 1: Close in
    .to('#leftHand', { x: '-22vw', opacity: 0.8, duration: 0.4, ease: 'none' }, 0)
    .to('#rightHand', { x: '12vw', opacity: 0.8, duration: 0.4, ease: 'none' }, 0)

    // Phase 2: Tension
    .to('#leftHand', { x: '-18vw', scale: 1.02, duration: 0.2, ease: 'none' }, 0.4)
    .to('#rightHand', { x: '8vw', scale: 1.02, duration: 0.2, ease: 'none' }, 0.4)

    // Phase 3: Touch Moment
    .to('#leftHand', { x: '-14.7vw', scale: 1.05, opacity: 1, duration: 0.1, ease: 'none' }, 0.6)
    .to('#rightHand', { x: '4.7vw', scale: 1.05, opacity: 1, duration: 0.1, ease: 'none' }, 0.6)
    .to('#spark', { opacity: 1, scale: 1.6, duration: 0.05, ease: 'none' }, 0.6)
    .to('#bgGlow', { opacity: 1, duration: 0.1, ease: 'none' }, 0.6)

    // Phase 4: Hold & Wave
    .to('#spark', { scale: 2.5, opacity: 0.2, duration: 0.3, ease: 'none' }, 0.7)
    .fromTo('#wave1', { scale: 0, opacity: 0.8 }, { scale: 30, opacity: 0, duration: 0.3, ease: 'none' }, 0.7)
    .fromTo('#wave2', { scale: 0, opacity: 0.5 }, { scale: 50, opacity: 0, duration: 0.3, ease: 'none' }, 0.75)
    
    // Phase 5: Hold State (Keeps the hands fixed in the touched position before unpinning)
    .to({}, { duration: 1.0 }); // Increased hold duration heavily so it stops completely at the wave and stays fixed
});
