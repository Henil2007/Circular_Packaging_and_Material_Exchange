import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  decay: number; color: string;
  shape: 'circle' | 'leaf' | 'diamond';
  rot: number; rotV: number;
}

const COLORS = ['#10b981', '#34d399', '#6ee7b7', '#047857', '#d1fae5', '#a7f3d0'];

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Spawn particles continuously
    const spawn = () => {
      if (particles.current.length < 38) {
        const shapes: Particle['shape'][] = ['circle', 'leaf', 'diamond'];
        particles.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -(Math.random() * 0.6 + 0.3),
          size: Math.random() * 8 + 3,
          alpha: Math.random() * 0.25 + 0.05,
          decay: Math.random() * 0.0008 + 0.0004,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          shape: shapes[Math.floor(Math.random() * 3)],
          rot: Math.random() * 360,
          rotV: (Math.random() - 0.5) * 0.8,
        });
      }
    };

    const drawLeaf = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size, -size * 0.5, size, size * 0.5, 0, size);
      ctx.bezierCurveTo(-size, size * 0.5, -size, -size * 0.5, 0, -size);
      ctx.fill();
    };

    const drawDiamond = (ctx: CanvasRenderingContext2D, size: number) => {
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.6, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.6, 0);
      ctx.closePath();
      ctx.fill();
    };

    let spawnTimer = 0;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnTimer++;
      if (spawnTimer % 45 === 0) spawn();

      particles.current = particles.current.filter(p => p.alpha > 0.005 && p.y > -50);

      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotV;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'leaf') {
          drawLeaf(ctx, p.size);
        } else {
          drawDiamond(ctx, p.size);
        }

        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    // Seed initial particles
    for (let i = 0; i < 20; i++) {
      particles.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.6 + 0.2),
        size: Math.random() * 8 + 3,
        alpha: Math.random() * 0.18 + 0.04,
        decay: Math.random() * 0.0006 + 0.0003,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        shape: (['circle', 'leaf', 'diamond'] as Particle['shape'][])[Math.floor(Math.random() * 3)],
        rot: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 0.8,
      });
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  );
}
