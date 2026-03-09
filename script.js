/* ============================================
   EMBER — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Floating Ember Particles on Canvas ──
  const canvas = document.getElementById('emberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = -(Math.random() * 0.4 + 0.1);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeRate = Math.random() * 0.001 + 0.0005;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;

        // Warm ember colors
        const colors = [
          [212, 135, 77],
          [232, 169, 106],
          [240, 184, 122],
          [201, 169, 110],
          [255, 157, 61],
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.2;
        this.y += this.speedY;
        this.opacity -= this.fadeRate;

        if (this.opacity <= 0 || this.y < -20) {
          this.reset();
        }
      }

      draw() {
        const [r, g, b] = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity * 0.15})`;
        ctx.fill();
      }
    }

    // Create particles
    const count = Math.min(60, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < count; i++) {
      const p = new Particle();
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animFrame = requestAnimationFrame(animate);
    }
    animate();

    // Pause when hero is not visible
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!animFrame) animate();
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }, { threshold: 0.1 });
    heroObserver.observe(document.querySelector('.hero'));
  }

  // ── Navigation scroll effect ──
  const nav = document.getElementById('nav');
  const scrollThreshold = 80;

  function updateNav() {
    if (window.scrollY > scrollThreshold) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // ── Mobile nav toggle ──
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Scroll reveal animations ──
  const revealElements = document.querySelectorAll(
    '.truth-card, .practice-item, .alignment-item, .calendar-card, .community-card, ' +
    '.section-label, .section-title, .section-intro, .origin-content > *, ' +
    '.flame-text > *, .flame-glow, .verse-block, .invitation-content > *, .invitation-closing'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add staggered delay for grid items
        const parent = entry.target.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(c => c.classList.contains('reveal'));
          const index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.06}s`;
        }
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Smooth scroll for anchor links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

});
