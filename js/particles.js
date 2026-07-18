/* =========================================================
   particles.js — p5.js animated network background
   Soft, slow, low-CPU particle field with subtle mouse avoidance.
   ========================================================= */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvasEl = document.getElementById("particle-canvas");
  if (!canvasEl || typeof p5 === "undefined") return;

  const COLORS = [
    [91, 141, 239],   // blue
    [109, 211, 206],  // teal
    [148, 120, 224]   // soft purple
  ];

  const sketch = (p) => {
    let particles = [];
    let count = 70;
    const linkDist = 130;
    const maxSpeed = 0.28;
    const avoidRadius = 90;

    function computeCount() {
      const area = window.innerWidth * window.innerHeight;
      return Math.max(35, Math.min(90, Math.round(area / 22000)));
    }

    class Particle {
      constructor() {
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        const a = p.random(p.TWO_PI);
        this.vel = p5.Vector.fromAngle(a).mult(p.random(0.05, maxSpeed));
        this.color = p.random(COLORS);
        this.baseAlpha = p.random(0.1, 0.3);
        this.radius = p.random(1.4, 2.6);
      }
      update(mouseX, mouseY, hasMouse) {
        if (hasMouse) {
          const d = p.dist(this.pos.x, this.pos.y, mouseX, mouseY);
          if (d < avoidRadius) {
            const away = p5.Vector.sub(this.pos, p.createVector(mouseX, mouseY));
            away.setMag(p.map(d, 0, avoidRadius, 0.06, 0));
            this.vel.add(away);
          }
        }
        this.vel.limit(maxSpeed);
        this.pos.add(this.vel);

        if (this.pos.x < -20) this.pos.x = p.width + 20;
        if (this.pos.x > p.width + 20) this.pos.x = -20;
        if (this.pos.y < -20) this.pos.y = p.height + 20;
        if (this.pos.y > p.height + 20) this.pos.y = -20;
      }
      draw() {
        p.noStroke();
        p.fill(this.color[0], this.color[1], this.color[2], this.baseAlpha * 255);
        p.circle(this.pos.x, this.pos.y, this.radius * 2);
      }
    }

    function buildParticles() {
      particles = [];
      count = computeCount();
      for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    p.setup = () => {
      const c = p.createCanvas(window.innerWidth, window.innerHeight);
      c.parent(canvasEl.parentElement);
      c.canvas.id = "particle-canvas";
      canvasEl.replaceWith(c.canvas);
      p.frameRate(60);
      buildParticles();
    };

    p.windowResized = () => {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
      buildParticles();
    };

    p.draw = () => {
      p.clear();

      const hasMouse = p.mouseX > 0 && p.mouseY > 0 && p.mouseX < p.width && p.mouseY < p.height;

      // Links
      p.strokeWeight(1);
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
          if (d < linkDist) {
            const alpha = p.map(d, 0, linkDist, 40, 0);
            p.stroke(184, 225, 255, alpha);
            p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
          }
        }
      }

      // Particles
      for (const particle of particles) {
        particle.update(p.mouseX, p.mouseY, hasMouse);
        particle.draw();
      }
    };

    // Static single render for reduced-motion users
    if (reduceMotion) {
      p.draw = () => {
        p.clear();
        p.strokeWeight(1);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            if (d < linkDist) {
              const alpha = p.map(d, 0, linkDist, 30, 0);
              p.stroke(184, 225, 255, alpha);
              p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
            }
          }
        }
        for (const particle of particles) particle.draw();
        p.noLoop();
      };
    }
  };

  new p5(sketch);
})();
