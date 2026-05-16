// =====================================================
// animations.js — Smash Studio
// =====================================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Draggable } from 'gsap/Draggable';
import { Observer } from 'gsap/Observer';
import { TextPlugin } from 'gsap/TextPlugin';
import { CustomEase } from 'gsap/CustomEase';
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable, Observer, TextPlugin, CustomEase);

export function initAnimations() {
  // Kill any stale triggers (Vite HMR safety)
  ScrollTrigger.getAll().forEach(t => t.kill());

  try {
    // ── Brand Easing ─────────────────────────────────
    CustomEase.create("smash", "M0,0 C0.075,0.82 0.165,1 1,1");
    gsap.ticker.lagSmoothing(500, 33);
    gsap.config({ force3D: true });

    // ────────────────────────────────────────────────
    // 1. SCROLL SMOOTHER
    // ────────────────────────────────────────────────
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.5,
      effects: true,
      smoothTouch: 0.1, // Better for mobile performance
      normalizeScroll: true,
    });

    // ────────────────────────────────────────────────
    // 2. HERO — Set initial states then reveal
    // ────────────────────────────────────────────────
    gsap.set('.hero-headline .line-inner', { yPercent: 110, rotateX: 40, skewY: 7 });
    gsap.set(['#hero-eyebrow', '#hero-sub', '#hero-actions'], { opacity: 0, y: 30 });
    gsap.set('.hero-float-card', { opacity: 0, y: 40, scale: 0.9, rotateZ: -5 });

    const heroTL = gsap.timeline({
      delay: 0.2, // Small delay to sync with body fade-in
      defaults: { ease: "smash" }
    });

    heroTL
      .from('#main-nav', { y: -20, opacity: 0, duration: 0.8, ease: "smash" })
      .to('.hero-headline .line-inner', {
        yPercent: 0,
        rotateX: 0,
        skewY: 0,
        stagger: 0.12,
        duration: 1.4,
        ease: "power4.out"
      }, 0.1)
      .to('#hero-eyebrow', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "smash"
      }, 0.3)
      .to('#hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "smash"
      }, 0.45)
      .to('#hero-actions', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "smash"
      }, 0.6)
      .to('.hero-float-card', {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateZ: 0,
        stagger: 0.15,
        duration: 1.2,
        ease: "smash"
      }, 0.5);

    gsap.set('.hero-content', { perspective: 1000 });

    gsap.to('.hero-float-card.card-1', { y: -14, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.0 });
    gsap.to('.hero-float-card.card-2', { y: -18, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.2 });
    gsap.to('.hero-float-card.card-3', { y: -10, duration: 4.2, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.1 });

    gsap.to('.hero-content', {
      yPercent: 20, ease: "none",
      scrollTrigger: { trigger: "#hero", start: "top top", end: "bottom top", scrub: true }
    });

    // ────────────────────────────────────────────────
    // 3. MOBILE NAV & BURGER
    // ────────────────────────────────────────────────
    const burger = document.getElementById('burger-trigger');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-links a, .mobile-cta');

    // ── SCROLL TO CONTACT (GLOBAL) ─────────────────
    const scrollToContact = (e) => {
      e.preventDefault();
      if (mobileNav && mobileNav.classList.contains('active')) {
        burger.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
      }
      smoother.scrollTo("#contact", true, "top top");
    };

    document.querySelectorAll('a[href="#contact"], .btn-primary').forEach(btn => {
      btn.addEventListener('click', scrollToContact);
    });

    // General Smooth Scroll for all internal anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      if (anchor.getAttribute('href') === '#contact') return;
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        if (target !== "#") {
          if (mobileNav && mobileNav.classList.contains('active')) {
            burger.classList.remove('active');
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
          }
          smoother.scrollTo(target, true, "top top");
        }
      });
    });

    if (burger && mobileNav) {
      burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileNav.classList.toggle('active');
        if (mobileNav.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
          gsap.from('.mobile-links li', {
            opacity: 0, y: 30, stagger: 0.1, delay: 0.3, ease: "smash"
          });
        } else {
          document.body.style.overflow = '';
        }
      });

      mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          burger.classList.remove('active');
          mobileNav.classList.remove('active');
          document.body.style.overflow = '';
        });
      });
    }

    ScrollTrigger.create({
      start: "top -60",
      onUpdate: self => {
        document.getElementById('main-nav')?.classList.toggle('scrolled', self.progress > 0);
      }
    });

    // ────────────────────────────────────────────────
    // 4. CUSTOM CURSOR
    // ────────────────────────────────────────────────

    // ────────────────────────────────────────────────
    // 5. SERVICES — Horizontal Scroll (Pinned)
    // ────────────────────────────────────────────────
    let mm = gsap.matchMedia();

    mm.add("(min-width: 981px)", () => {
      const sTrack = document.getElementById('services-track');
      if (sTrack) {
        gsap.to(sTrack, {
          x: () => -(sTrack.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: "#services",
            pin: true,
            start: "top top",
            scrub: 1,
            end: () => "+=" + sTrack.scrollWidth,
            invalidateOnRefresh: true
          }
        });
      }
    });

    // Mobile specific vertical layout fix
    mm.add("(max-width: 980px)", () => {
      gsap.utils.toArray('.service-card').forEach(card => {
        gsap.from(card, {
          y: 50,
          duration: 1,
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            once: true
          }
        });
      });
    });

    // ────────────────────────────────────────────────
    // 6. PROCESS SECTION REVEALS
    // ────────────────────────────────────────────────
    gsap.from('#process-title', {
      y: 60, duration: 1.2, ease: "smash",
      scrollTrigger: { trigger: '#process-title', start: "top 95%", once: true }
    });

    gsap.to('.process-bg-text', {
      xPercent: -20, ease: "none",
      scrollTrigger: {
        trigger: "#process",
        start: "top bottom", end: "bottom top",
        scrub: 1
      }
    });

    gsap.utils.toArray('.process-step').forEach((step, i) => {
      gsap.from(step, {
        y: 50, duration: 0.9,
        delay: i * 0.08, ease: "smash",
        scrollTrigger: { trigger: step, start: "top 95%", once: true }
      });
    });

    // ────────────────────────────────────────────────
    // 7. TECH / AUTHORITY REVEALS
    // ────────────────────────────────────────────────
    gsap.from('#tech-headline', {
      y: 50, duration: 1, ease: "smash",
      scrollTrigger: { trigger: '#tech-headline', start: "top 95%", once: true }
    });

    gsap.from('.tech-body', {
      y: 30, duration: 0.9, ease: "smash",
      scrollTrigger: { trigger: '.tech-body', start: "top 95%", once: true }
    });

    gsap.utils.toArray('.stat-card').forEach((card, i) => {
      gsap.from(card, {
        y: 40, scale: 0.95, duration: 0.8,
        delay: i * 0.08, ease: "smash",
        scrollTrigger: { trigger: '.stats-grid', start: "top 95%", once: true }
      });
    });

    // Counters
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      let triggered = false;
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        onEnter: () => {
          if (triggered) return;
          triggered = true;
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2.5, ease: "power2.out",
            onUpdate: () => { el.textContent = Math.round(obj.val); }
          });
        }
      });
    });

    gsap.utils.toArray('.authority-card').forEach((card, i) => {
      gsap.from(card, {
        y: 40, duration: 0.8,
        delay: i * 0.1, ease: "smash",
        scrollTrigger: { trigger: '.authority-grid', start: "top 95%", once: true }
      });
    });

    // ────────────────────────────────────────────────
    // 8. MARQUEE
    // ────────────────────────────────────────────────
    const marqueeEl = document.getElementById('marquee-1');
    if (marqueeEl) {
      gsap.to(marqueeEl, {
        xPercent: -50,
        duration: 28,
        ease: "none",
        repeat: -1
      });
    }

    // ────────────────────────────────────────────────
    // 9. TESTIMONIALS — Draggable
    // ────────────────────────────────────────────────
    gsap.from('#testimonials-title', {
      y: 40, duration: 1, ease: "smash",
      scrollTrigger: { trigger: '#testimonials-title', start: "top 95%", once: true }
    });

    const tTrack = document.getElementById('testimonials-track');

    if (tTrack) {
      // Duplicate cards for seamless loop
      tTrack.innerHTML += tTrack.innerHTML;

      const totalWidth = tTrack.scrollWidth / 2;

      const testimonialLoop = gsap.to(tTrack, {
        x: `-=${totalWidth}`,
        duration: 30,
        ease: "none",
        repeat: -1,
        modifiers: {
          x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
        }
      });

      // Pause only this animation on hover, not global timeline
      tTrack.addEventListener('mouseenter', () => {
        testimonialLoop.pause();
      });

      tTrack.addEventListener('mouseleave', () => {
        testimonialLoop.resume();
      });
    }
    // ────────────────────────────────────────────────
    // 10. CONTACT SECTION
    // ────────────────────────────────────────────────
    gsap.from('#contact-title', {
      y: 60, duration: 1.2, ease: "smash",
      scrollTrigger: { trigger: '#contact-title', start: "top 95%", once: true }
    });

    gsap.from('.contact-tagline', {
      y: 30, duration: 0.9, ease: "smash",
      scrollTrigger: { trigger: '.contact-tagline', start: "top 95%", once: true }
    });

    gsap.from('.contact-form .form-field, .form-submit', {
      y: 30, stagger: 0.1, duration: 0.8, ease: "smash",
      scrollTrigger: { trigger: '.contact-form', start: "top 98%", once: true }
    });

    // Submit button handling (API Connection)
    const submitBtn = document.getElementById('submit-btn');
    if (submitBtn) {
      submitBtn.addEventListener('click', async function (e) {
        e.preventDefault();
        
        const name = document.getElementById('field-user-name')?.value;
        const organization = document.getElementById('field-org-name')?.value;
        const email = document.getElementById('field-email')?.value;
        const domain = document.getElementById('field-domain')?.value;
        const message = document.getElementById('field-message')?.value;

        if (!name || !organization || !email || !message) {
          alert('Please fill in all required fields.');
          return;
        }

        const label = this.querySelector('span');
        const originalText = label.textContent;
        label.textContent = "Connecting...";
        this.disabled = true;

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, organization, email, domain, message })
          });

          const result = await response.json();

          if (result.success) {
            // Particle burst on success
            const rect = this.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            for (let i = 0; i < 30; i++) {
              const dot = document.createElement('div');
              dot.className = 'particle';
              dot.style.cssText = `left:${cx}px;top:${cy}px;background:${['#35A8F2', '#1B4FB8', '#00C2FF'][i % 3]};`;
              document.body.appendChild(dot);
              const angle = (i / 30) * Math.PI * 2;
              const speed = 100 + Math.random() * 200;
              gsap.to(dot, {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed + 60,
                opacity: 0, scale: 0,
                duration: 0.8 + Math.random() * 0.5,
                ease: "power2.out",
                onComplete: () => dot.remove()
              });
            }
            label.textContent = "Transmission Confirmed";
            this.style.background = "#1DAB72";
            
            // Clear form
            document.getElementById('field-user-name').value = '';
            document.getElementById('field-org-name').value = '';
            document.getElementById('field-email').value = '';
            document.getElementById('field-domain').value = '';
            document.getElementById('field-message').value = '';
          } else {
            throw new Error(result.message);
          }
        } catch (err) {
          console.error("Transmission Error:", err);
          label.textContent = "Connection Failed";
          this.style.background = "#E8531A";
          setTimeout(() => {
            label.textContent = originalText;
            this.style.background = "";
            this.disabled = false;
          }, 3000);
        }
      });
    }

    // ────────────────────────────────────────────────
    // 11. MAGNETIC BUTTONS
    // ────────────────────────────────────────────────
    document.querySelectorAll('.btn-primary, .btn-ghost, .form-submit, .nav-cta').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.25,
          y: (e.clientY - r.top - r.height / 2) * 0.25,
          duration: 0.4, ease: "power2.out"
        });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1.2, 0.4)" });
      });
    });

    // ────────────────────────────────────────────────
    // 12. FOOTER
    // ────────────────────────────────────────────────
    gsap.from('footer > div, footer ul, .footer-copy', {
      y: 40,
      stagger: 0.15,
      duration: 1.2,
      ease: "smash",
      scrollTrigger: {
        trigger: 'footer',
        start: "top 98%",
        once: true
      }
    });

    gsap.to('.footer-logo', {
      backgroundPosition: '200% 0',
      duration: 10,
      repeat: -1,
      ease: "none"
    });

    // --- Floating Service Assets ---
    gsap.to('.service-asset', {
      y: -20,
      rotation: 8,
      duration: 3.5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.4,
        from: "random"
      }
    });

    // --- New Floating 3D Assets Parallax ---
    gsap.to('.asset-sphere', {
      yPercent: 30,
      rotation: 15,
      ease: "none",
      scrollTrigger: {
        trigger: '#services',
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    gsap.to('.asset-3d-polygon', {
      yPercent: -40,
      rotation: -25,
      scale: 1.1,
      ease: "none",
      scrollTrigger: {
        trigger: '#process',
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });


    // ────────────────────────────────────────────────
    // 13. REFRESH (must be last)
    // ────────────────────────────────────────────────
    ScrollTrigger.refresh();

    // Safety: if any scroll-animated element is already visible (e.g. zoomed out),
    // immediately clear its hidden state so it never stays invisible
    ScrollTrigger.addEventListener('refresh', () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.progress === 1) st.animation?.progress(1);
      });
    });

    console.log("✅ Smash Studio — Animations Initialized");

  } catch (err) {
    console.error("❌ Animation Error:", err);
    // Ensure hero content is always visible if animation fails
    gsap.set('.hero-headline .line-inner', { clearProps: 'all' });
    gsap.set(['#hero-eyebrow', '#hero-sub', '#hero-actions', '.hero-float-card'], { clearProps: 'all' });
  }
}
