import React, { useEffect, useRef } from 'react';
import { ThemeId } from '../types';
import { globalAudio } from '../audio/AudioEngine';

interface ThemeCanvasProps {
  themeId: ThemeId;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  angle?: number;
  spin?: number;
  oscillation?: number;
}

export const ThemeCanvas: React.FC<ThemeCanvasProps> = ({ themeId }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

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
      initParticles();
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.targetX = (e.clientX - width / 2) * 0.05;
      mousePosRef.current.targetY = (e.clientY - height / 2) * 0.05;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosRef.current.targetX = (e.touches[0].clientX - width / 2) * 0.05;
        mousePosRef.current.targetY = (e.touches[0].clientY - height / 2) * 0.05;
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    let particles: Particle[] = [];

    const getParticleCount = () => {
      if (themeId === 'rain') return 120;
      if (themeId === 'stars' || themeId === 'night_sky' || themeId === 'galaxy') return 150;
      if (themeId === 'petals' || themeId === 'sakura') return 45;
      if (themeId === 'fireflies' || themeId === 'forest') return 40;
      return 60;
    };

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();

      for (let i = 0; i < count; i++) {
        let p: Particle;
        if (themeId === 'rain') {
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speedX: -0.5,
            speedY: Math.random() * 12 + 10,
            alpha: Math.random() * 0.5 + 0.2,
            maxAlpha: 0.7,
            color: 'rgba(186, 230, 253, ',
          };
        } else if (themeId === 'sakura') {
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 6 + 4,
            speedX: Math.random() * 1 + 0.5,
            speedY: Math.random() * 1.5 + 0.8,
            alpha: Math.random() * 0.7 + 0.3,
            maxAlpha: 0.9,
            color: 'rgba(244, 114, 182, ',
            angle: Math.random() * Math.PI * 2,
            spin: (Math.random() - 0.5) * 0.03,
            oscillation: Math.random() * Math.PI * 2,
          };
        } else if (themeId === 'forest') {
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3.5 + 1.5,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6,
            alpha: Math.random() * 0.8 + 0.2,
            maxAlpha: 0.95,
            color: 'rgba(134, 239, 172, ',
            oscillation: Math.random() * Math.PI * 2,
          };
        } else if (themeId === 'ocean') {
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: -(Math.random() * 0.8 + 0.2),
            alpha: Math.random() * 0.4 + 0.1,
            maxAlpha: 0.6,
            color: 'rgba(165, 243, 252, ',
          };
        } else if (themeId === 'sunset') {
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2.5 + 1,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: -(Math.random() * 1 + 0.2),
            alpha: Math.random() * 0.6 + 0.2,
            maxAlpha: 0.8,
            color: 'rgba(251, 146, 60, ',
          };
        } else {
          // Night Sky, Galaxy, Aurora, Coffee Shop, Minimal White, Vintage Paper
          const isGalaxy = themeId === 'galaxy';
          const isAurora = themeId === 'aurora';
          p = {
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * (isGalaxy ? 2.5 : 1.8) + 0.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
            alpha: Math.random() * 0.8 + 0.2,
            maxAlpha: 0.9,
            color: isGalaxy
              ? 'rgba(216, 180, 254, '
              : isAurora
              ? 'rgba(153, 246, 228, '
              : 'rgba(255, 255, 255, ',
          };
        }
        particles.push(p);
      }
    };

    initParticles();

    // Render loop
    const render = () => {
      // Smooth mouse damping
      mousePosRef.current.x += (mousePosRef.current.targetX - mousePosRef.current.x) * 0.05;
      mousePosRef.current.y += (mousePosRef.current.targetY - mousePosRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const spectrumPulse = globalAudio.getAudioSpectrum() * 25;

      // Draw background theme gradient overlay
      if (themeId === 'aurora') {
        const time = Date.now() * 0.0008;
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, `rgba(13, 148, 136, ${0.15 + spectrumPulse * 0.005})`);
        grad.addColorStop(0.5, `rgba(147, 51, 234, ${0.12 + Math.sin(time) * 0.05})`);
        grad.addColorStop(1, 'rgba(5, 5, 5, 0.9)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (themeId === 'galaxy') {
        const grad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width);
        grad.addColorStop(0, `rgba(126, 34, 206, ${0.18 + spectrumPulse * 0.004})`);
        grad.addColorStop(0.6, 'rgba(15, 23, 42, 0.4)');
        grad.addColorStop(1, 'rgba(3, 7, 18, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else if (themeId === 'ocean') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, 'rgba(8, 51, 68, 0.3)');
        grad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw particles
      particles.forEach((p) => {
        if (themeId === 'rain') {
          p.y += p.speedY;
          p.x += p.speedX;
          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }

          ctx.beginPath();
          ctx.strokeStyle = p.color + p.alpha + ')';
          ctx.lineWidth = p.size;
          ctx.moveTo(p.x + mousePosRef.current.x * 0.2, p.y + mousePosRef.current.y * 0.2);
          ctx.lineTo(
            p.x + p.speedX * 2 + mousePosRef.current.x * 0.2,
            p.y + p.speedY * 1.2 + mousePosRef.current.y * 0.2
          );
          ctx.stroke();
        } else if (themeId === 'sakura') {
          p.y += p.speedY;
          p.oscillation = (p.oscillation || 0) + 0.02;
          p.x += p.speedX + Math.sin(p.oscillation) * 0.5;
          if (p.angle !== undefined && p.spin !== undefined) {
            p.angle += p.spin;
          }

          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }

          ctx.save();
          ctx.translate(p.x + mousePosRef.current.x * 0.3, p.y + mousePosRef.current.y * 0.3);
          ctx.rotate(p.angle || 0);
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.beginPath();
          // Draw petal oval shape
          ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (themeId === 'forest') {
          // Fireflies glowing
          p.oscillation = (p.oscillation || 0) + 0.03;
          p.x += p.speedX + Math.sin(p.oscillation) * 0.3;
          p.y += p.speedY + Math.cos(p.oscillation) * 0.3;
          const currentAlpha = Math.abs(Math.sin(p.oscillation)) * p.maxAlpha;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.fillStyle = p.color + currentAlpha + ')';
          ctx.arc(p.x + mousePosRef.current.x * 0.5, p.y + mousePosRef.current.y * 0.5, p.size + spectrumPulse * 0.05, 0, Math.PI * 2);
          ctx.fill();

          // Outer firefly glow
          ctx.beginPath();
          ctx.fillStyle = p.color + (currentAlpha * 0.25) + ')';
          ctx.arc(p.x + mousePosRef.current.x * 0.5, p.y + mousePosRef.current.y * 0.5, (p.size * 2.5) + spectrumPulse * 0.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // General floating stars / dust particles
          p.x += p.speedX;
          p.y += p.speedY;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.fillStyle = p.color + p.alpha + ')';
          ctx.arc(
            p.x + mousePosRef.current.x * (p.size * 0.2),
            p.y + mousePosRef.current.y * (p.size * 0.2),
            p.size + (spectrumPulse > 2 ? Math.random() * 0.5 : 0),
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000"
    />
  );
};
