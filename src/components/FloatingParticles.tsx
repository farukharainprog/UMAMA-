import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  type: 'heart' | 'petal' | 'sparkle';
  color: string;
}

export const FloatingParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const particleCount = window.innerWidth < 768 ? 28 : 55;
    const particles: Particle[] = [];

    const colors = {
      heart: ['#fb7185', '#f43f5e', '#fda4af', '#f472b6'],
      petal: ['#fbcfe8', '#f472b6', '#ec4899', '#fda4af'],
      sparkle: ['#fef08a', '#facc15', '#fbbf24', '#ffffff'],
    };

    for (let i = 0; i < particleCount; i++) {
      const typeRand = Math.random();
      const type: 'heart' | 'petal' | 'sparkle' =
        typeRand < 0.4 ? 'heart' : typeRand < 0.75 ? 'petal' : 'sparkle';

      const typeColors = colors[type];
      const color = typeColors[Math.floor(Math.random() * typeColors.length)];

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === 'sparkle' ? Math.random() * 3 + 2 : Math.random() * 8 + 6,
        speedY: -(Math.random() * 0.7 + 0.3),
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        type,
        color,
      });
    }

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      c.save();
      c.translate(x, y);
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 2 + size * 0.3, 0, size);
      c.bezierCurveTo(0, (size + topCurveHeight) / 2 + size * 0.3, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      c.fill();
      c.restore();
    };

    const drawPetal = (c: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      c.ellipse(0, 0, size * 0.5, size * 0.9, 0, 0, Math.PI * 2);
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, angle: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.beginPath();
      for (let i = 0; i < 4; i++) {
        c.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
        c.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.3));
      }
      c.closePath();
      c.fill();
      c.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.6 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size);
        } else if (p.type === 'petal') {
          drawPetal(ctx, p.x, p.y, p.size, p.rotation);
        } else {
          drawSparkle(ctx, p.x, p.y, p.size, p.rotation);
        }
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-65"
      aria-hidden="true"
    />
  );
};
