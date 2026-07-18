/* =========================================================
   animation.js — GSAP scroll reveals, magnetic buttons, tilt
   ========================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    gsap.registerPlugin(ScrollTrigger);

    /* ---------- Hero entrance ---------- */
    if (!reduceMotion) {
      gsap.from(".hero-copy > *", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15
      });
      gsap.from(".avatar-ring", {
        scale: 0.85,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3
      });
    } else {
      document.querySelectorAll(".hero-copy > *, .avatar-ring").forEach((el) => {
        el.style.opacity = 1;
      });
    }

    /* ---------- Scroll reveal for [data-reveal] ---------- */
    const revealEls = document.querySelectorAll("[data-reveal]");
    revealEls.forEach((el, i) => {
      if (reduceMotion) {
        el.classList.add("revealed");
        return;
      }
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          el.classList.add("revealed");
        }
      });
    });

    /* ---------- Skill bars fill when in view ---------- */
    document.querySelectorAll(".skill-card").forEach((card) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 80%",
        once: true,
        onEnter: () => card.classList.add("in-view")
      });
    });

    /* ---------- Magnetic buttons (desktop only, fine pointer) ---------- */
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (canHover && !reduceMotion) {
      document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
        btn.addEventListener("mousemove", (e) => {
          const rect = btn.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(btn, { x: x * 0.18, y: y * 0.35, duration: 0.3, ease: "power2.out" });
        });
        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
        });
      });

      /* ---------- Subtle card tilt ---------- */
      document.querySelectorAll(".project-card, .skill-card").forEach((card) => {
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateX: py * -4,
            rotateY: px * 4,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 600
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        });
      });
    }
  });
})();
