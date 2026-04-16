import { memo, useEffect, useRef } from 'react';

class Particle {
  x = 0;
  y = 0;
  size = 0;
  speedX = 0;
  speedY = 0;
  opacity = 0;

  constructor(private width: number, private height: number) {
    this.reset();
  }

  setBounds(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  reset() {
    this.x = Math.random() * this.width;
    this.y = Math.random() * this.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.15 + 0.03;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.width || this.y < 0 || this.y > this.height) {
      this.reset();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(74, 222, 128, ${this.opacity})`;
    ctx.fill();
  }
}

function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.forEach((p) => p.setBounds(canvas.width, canvas.height));
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const PARTICLE_COUNT = 35;
    const LINK_DIST = 150;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    window.addEventListener('resize', resize);

    let rafId = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < LINK_DIST_SQ) {
            const ratio = 1 - Math.sqrt(distSq) / LINK_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(74, 222, 128, ${0.03 * ratio})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas id="particles" ref={canvasRef} />;
}

export default memo(Particles);
