document.addEventListener('DOMContentLoaded', () => {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  const spotlight = document.querySelector('.spotlight');
  
  // TRACK MOUSE
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Dot follows instantly
    if (dot) {
      dot.style.transform = `translate(${mouseX - 6}px, ${mouseY - 6}px)`;
    }
    
    // Spotlight follow
    if (spotlight) {
      const vx = e.movementX || 0;
      const vy = e.movementY || 0;
      const speed = Math.hypot(vx, vy);
      spotlight.style.opacity = Math.min(0.06 + speed * 0.003, 0.18);
      spotlight.style.background = `radial-gradient(600px at ${mouseX}px ${mouseY}px, rgba(184,255,87,0.12), transparent 70%)`;
    }
  }, { passive: true });

  // LERP RING
  (function lerp() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    if (ring) {
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
    }
    requestAnimationFrame(lerp);
  })();

  // HOVER STATES
  const updateCursorState = (isLink, isProject) => {
    if (!ring) return;
    ring.classList.toggle('is-link', isLink);
    ring.classList.toggle('is-project', isProject);
    const label = ring.querySelector('.ring-label');
    if (label) label.textContent = isProject ? 'OPEN' : (isLink ? 'VIEW' : '');
  };

  document.querySelectorAll('a, button, .nav-cta').forEach(el => {
    el.addEventListener('mouseenter', () => updateCursorState(true, false));
    el.addEventListener('mouseleave', () => updateCursorState(false, false));
  });

  document.querySelectorAll('.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => updateCursorState(false, true));
    el.addEventListener('mouseleave', () => updateCursorState(false, false));
  });

  // MAGNETIC BUTTONS
  document.querySelectorAll('.btn-primary, .btn-ghost, .nav-cta').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // ANTI-GRAVITY CHIPS
  const chips = document.querySelectorAll('.float-chip');
  const chipTargets = Array.from(chips).map(() => ({ tx: 0, ty: 0, cx: 0, cy: 0 }));

  chips.forEach((chip, i) => {
    // Idle float
    gsap.to(chip, {
      y: `+=${10 + i * 2}`,
      duration: 4 + i * 0.7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  document.addEventListener('mousemove', e => {
    chips.forEach((chip, i) => {
      const rect = chip.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const radius = 180;

      if (dist < radius) {
        const force = (1 - dist / radius) * 70;
        chipTargets[i].tx = -(dx / dist) * force;
        chipTargets[i].ty = -(dy / dist) * force;
      } else {
        chipTargets[i].tx = 0;
        chipTargets[i].ty = 0;
      }
    });
  }, { passive: true });

  (function chipLerp() {
    chips.forEach((chip, i) => {
      chipTargets[i].cx += (chipTargets[i].tx - chipTargets[i].cx) * 0.08;
      chipTargets[i].cy += (chipTargets[i].ty - chipTargets[i].cy) * 0.08;
      chip.style.translate = `${chipTargets[i].cx}px ${chipTargets[i].cy}px`;
    });
    requestAnimationFrame(chipLerp);
  })();

  // CARD TILT
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      gsap.to(card, {
        rotateY: x * 16,
        rotateX: -y * 16,
        transformPerspective: 800,
        ease: 'power1.out',
        duration: 0.4
      });

      const shine = card.querySelector('.tilt-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.06), transparent 60%)`;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
});
