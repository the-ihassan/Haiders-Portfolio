/* =========================================================
   main.js — navigation, smooth scroll, typing text,
   scroll-spy, contact form, back-to-top, ripple, cursor glow
   ========================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", () => {

    /* ---------- Theme (dark/light) ---------- */
    const root = document.documentElement;
    const themeToggle = document.getElementById("themeToggle");

    function setTheme(theme) {
      if (theme !== "light" && theme !== "dark") return;
      root.dataset.theme = theme;
      if (themeToggle) {
        const isLight = theme === "light";
        themeToggle.setAttribute("aria-pressed", String(isLight));
        const icon = themeToggle.querySelector(".theme-toggle-icon");
        if (icon) icon.textContent = isLight ? "☀️" : "🌙";
        themeToggle.style.color = isLight ? "var(--text)" : "var(--text)";

      }
    }

    function getPreferredTheme() {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
      return prefersLight ? "light" : "dark";
    }

    // Init theme immediately
    setTheme(getPreferredTheme());

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const current = root.dataset.theme === "light" ? "light" : "dark";
        const next = current === "light" ? "dark" : "light";
        localStorage.setItem("theme", next);
        setTheme(next);
      });
    }

    /* ---------- Footer year ---------- */

    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Lenis smooth scroll ---------- */
    let lenis;
    if (typeof Lenis !== "undefined" && !reduceMotion) {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      if (typeof ScrollTrigger !== "undefined") {
        lenis.on("scroll", ScrollTrigger.update);
      }
    }

    /* ---------- Mobile nav toggle ---------- */
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");

    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      });

      navMenu.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", () => {
          navMenu.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", "Open menu");
        });
      });
    }

    /* ---------- Scroll-spy active nav link ---------- */
    const sections = document.querySelectorAll("main .section[id], #home");
    const navLinks = document.querySelectorAll(".nav-link");

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle("active", link.dataset.section === id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => spyObserver.observe(s));

    /* ---------- Typing effect for hero role ---------- */
    const roles = [
      "Website Developer",
      "UI/UX Designer",
      "AI & ML Learner",
      "Creative Editor"
    ];
    const typedEl = document.getElementById("typedRole");

    if (typedEl) {
      if (reduceMotion) {
        typedEl.textContent = roles[0];
      } else {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function tick() {
          const current = roles[roleIndex];

          if (!deleting) {
            charIndex++;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
              deleting = true;
              setTimeout(tick, 1600);
              return;
            }
          } else {
            charIndex--;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
              deleting = false;
              roleIndex = (roleIndex + 1) % roles.length;
            }
          }
          setTimeout(tick, deleting ? 40 : 80);
        }
        tick();
      }
    }

    /* ---------- Back to top ---------- */
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
      window.addEventListener("scroll", () => {
        backToTop.classList.toggle("visible", window.scrollY > 480);
      }, { passive: true });

      backToTop.addEventListener("click", () => {
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.1 });
        } else {
          window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
        }
      });
    }

    /* ---------- Cursor glow (desktop, fine pointer) ---------- */
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const glow = document.getElementById("cursor-glow");
    if (canHover && glow && !reduceMotion) {
      window.addEventListener("mousemove", (e) => {
        glow.style.opacity = "1";
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      }, { passive: true });
      window.addEventListener("mouseleave", () => {
        glow.style.opacity = "0";
      });
    } else if (glow) {
      glow.remove();
    }

    /* ---------- Button ripple ---------- */
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const rect = btn.getBoundingClientRect();
        btn.style.setProperty("--ripple-x", `${e.clientX - rect.left}px`);
        btn.style.setProperty("--ripple-y", `${e.clientY - rect.top}px`);
        btn.classList.remove("rippling");
        // Force reflow to restart animation
        void btn.offsetWidth;
        btn.classList.add("rippling");
      });
    });

    /* ---------- Contact form (demo submit handler) ---------- */
    const form = document.querySelector(".contact-form");
    const formNote = document.getElementById("formNote");

    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          formNote.textContent = "Please fill in every field before sending.";
          formNote.style.color = "#e9a8a8";
          return;
        }
        formNote.textContent = "Message sent — thanks for reaching out! I'll reply soon.";
        formNote.style.color = "";
        form.reset();
      });
    }

  });
})();
