'use client';

import { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Warm color palette - INCREASED OPACITY for visibility
    const colors = [
      'rgba(212, 165, 116, 0.25)', // Primary sandy brown - increased from 0.08
      'rgba(201, 166, 107, 0.25)', // Burlywood - increased from 0.08
      'rgba(245, 222, 179, 0.25)', // Wheat - increased from 0.08
      'rgba(139, 115, 85, 0.20)',  // Soft brown - increased from 0.06
      'rgba(245, 245, 220, 0.25)', // Warm beige - increased from 0.08
    ];

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      opacity: number;
      angle: number;
      angleSpeed: number;

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 200 + 100; // Increased size from 150+50
        this.speedY = Math.random() * 0.5 + 0.2; // Faster movement
        this.speedX = Math.random() * 0.3 - 0.15; // More horizontal movement
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.6 + 0.4; // Increased from 0.5+0.3
        this.angle = Math.random() * Math.PI * 2;
        this.angleSpeed = (Math.random() - 0.5) * 0.003; // Faster rotation
      }

      update(scrollY: number, canvasWidth: number, canvasHeight: number) {
        // Parallax effect based on scroll
        const parallaxSpeed = 0.2;
        this.y = (this.y + this.speedY - scrollY * parallaxSpeed * 0.001) % canvasHeight;
        
        if (this.y < -this.size) {
          this.y = canvasHeight + this.size;
        }

        this.x += this.speedX;
        if (this.x > canvasWidth + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvasWidth + this.size;

        this.angle += this.angleSpeed;
      }

      draw() {
        if (!ctx) return;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Create gradient blob
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, this.color.replace(/[\d.]+\)$/, `${this.opacity})`));
        gradient.addColorStop(0.5, this.color.replace(/[\d.]+\)$/, `${this.opacity * 0.5})`));
        gradient.addColorStop(1, this.color.replace(/[\d.]+\)$/, '0)'));

        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        // Create organic blob shape
        const points = 8;
        for (let i = 0; i < points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const radiusVariation = Math.sin(this.angle + i) * 0.2 + 1;
          const x = Math.cos(angle) * this.size * radiusVariation;
          const y = Math.sin(angle) * this.size * radiusVariation;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Create particles - INCREASED COUNT
    const particleCount = 25; // Increased from 15
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas.width, canvas.height));
    }

    // Animation variables
    let lastScrollY = 0;
    let animationFrameId: number;

    // Animation loop
    const animate = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach(particle => {
        particle.update(scrollDelta, canvas.width, canvas.height);
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      style={{
        mixBlendMode: 'normal', // Changed from 'multiply' for better visibility
        opacity: 0.8, // Added overall opacity control
      }}
    />
  );
}
