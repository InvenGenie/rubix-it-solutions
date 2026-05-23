class Particle {
      constructor(canvas) {
        this.canvas = canvas;
        this.reset();
      }

      reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > this.canvas.width) this.x = 0;
        if (this.x < 0) this.x = this.canvas.width;
        if (this.y > this.canvas.height) this.y = 0;
        if (this.y < 0) this.y = this.canvas.height;
      }

      draw(ctx) {
        ctx.fillStyle = `rgba(100, 180, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Helper to initialize particles on a specific canvas element
    function initParticlesOnCanvas(canvasId, options = {}) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');

      function resizeCanvas() {
        canvas.width = canvas.clientWidth || window.innerWidth;
        canvas.height = canvas.clientHeight || window.innerHeight;
      }

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);

      const particleCount = options.particleCount || 80;
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas));
      }

      // Mouse interaction
      let mouse = { x: null, y: null, radius: options.mouseRadius || 150 };

      canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        particles.forEach(particle => {
          const dx = mouse.x - particle.x;
          const dy = mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            particle.x -= Math.cos(angle) * force * 2;
            particle.y -= Math.sin(angle) * force * 2;
          }
        });
      });

      canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
          particle.update();
          particle.draw(ctx);
        });

        // Draw connections
        particles.forEach((p1, i) => {
          particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.strokeStyle = `rgba(100, 180, 255, ${0.15 * (1 - distance / 120)})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          });
        });

        requestAnimationFrame(animate);
      }

      animate();

      return { canvas, particles };
    }

    // Auto-initialize the main hero particles and stacked section particles
    document.addEventListener('DOMContentLoaded', () => {
      // existing canvas id is 'particles-canvas'
      initParticlesOnCanvas('particles-canvas', { particleCount: 140, mouseRadius: 160 });
      // stacked services smaller/softer effect
      initParticlesOnCanvas('particles-canvas-stacked', { particleCount: 100, mouseRadius: 120 });
      // new canvas for contact overlay
      initParticlesOnCanvas('contact-particles', { particleCount: 100, mouseRadius: 140 });

    });