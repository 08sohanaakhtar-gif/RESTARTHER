/**
 * RestartHER - Ambient Kinetic Particle Canvas Engine
 * Renders floating metallic gold, rose gold, and deep plum light particles
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 65;
        this.mouse = { x: null, y: null, radius: 140 };
        this.colors = [
            'rgba(212, 175, 55, ',    // Champagne Gold #D4AF37
            'rgba(243, 229, 171, ',   // Pale Gold #F3E5AB
            'rgba(224, 30, 90, ',     // Vibrant Rose Fuchsia #E01E5A
            'rgba(232, 167, 161, ',   // Soft Rose Gold #E8A7A1
            'rgba(180, 120, 240, '    // Violet Iris
        ];

        this.init();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    init() {
        this.resize();
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        this.animate();
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 2.8 + 0.8,
            baseAlpha: Math.random() * 0.5 + 0.2,
            alpha: Math.random() * 0.5 + 0.2,
            speedX: (Math.random() - 0.5) * 0.45,
            speedY: -Math.random() * 0.55 - 0.15, // Gentle upward drifting
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Update position
            p.x += p.speedX;
            p.y += p.speedY;
            p.pulseOffset += p.pulseSpeed;
            p.alpha = p.baseAlpha + Math.sin(p.pulseOffset) * 0.25;

            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += (dx / dist) * force * 1.8;
                    p.y += (dy / dist) * force * 1.8;
                }
            }

            // Wrap around edges
            if (p.y < -10) {
                p.y = this.height + 10;
                p.x = Math.random() * this.width;
            }
            if (p.x < -10) p.x = this.width + 10;
            if (p.x > this.width + 10) p.x = -10;

            // Render glowing circle
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + Math.max(0.05, Math.min(0.9, p.alpha)) + ')';
            this.ctx.shadowBlur = p.size * 5;
            this.ctx.shadowColor = p.color + '0.8)';
            this.ctx.fill();
            this.ctx.restore();
        }

        requestAnimationFrame(() => this.animate());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParticleEngine('ambient-canvas');
});
