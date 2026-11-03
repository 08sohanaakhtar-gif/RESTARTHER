/**
 * RestartHER - Interactive SVG Skills Radar & Delta Visualizer
 * Visualizes competency transferability and simulates real-time micro-credential bridging
 */

class SkillsRadar {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.skills = [
            { name: 'Distributed Systems', past: 92, target: 95, current: 92 },
            { name: 'SAP BTP & CAP', past: 75, target: 94, current: 75 },
            { name: 'Enterprise GenAI', past: 40, target: 85, current: 40 },
            { name: 'Node.js & Cloud', past: 90, target: 95, current: 90 },
            { name: 'Leadership & Empathy', past: 95, target: 98, current: 95 }
        ];

        this.size = 280;
        this.center = this.size / 2;
        this.radius = 95;
        this.isBridged = false;

        this.render();
    }

    getCoordinates(index, total, value) {
        const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
        const r = (value / 100) * this.radius;
        return {
            x: this.center + r * Math.cos(angle),
            y: this.center + r * Math.sin(angle)
        };
    }

    getPolygonPoints(valKey) {
        return this.skills.map((s, i) => {
            const pt = this.getCoordinates(i, this.skills.length, s[valKey]);
            return `${pt.x},${pt.y}`;
        }).join(' ');
    }

    render() {
        const total = this.skills.length;

        // Concentric guide rings (25%, 50%, 75%, 100%)
        const rings = [0.25, 0.5, 0.75, 1.0].map(ratio => {
            const r = this.radius * ratio;
            return `<circle cx="${this.center}" cy="${this.center}" r="${r}" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-dasharray="3 3"/>`;
        }).join('');

        // Radial axis lines & labels
        const axes = this.skills.map((s, i) => {
            const end = this.getCoordinates(i, total, 100);
            const labelPt = this.getCoordinates(i, total, 122);
            return `
                <line x1="${this.center}" y1="${this.center}" x2="${end.x}" y2="${end.y}" stroke="rgba(255, 255, 255, 0.12)" />
                <text x="${labelPt.x}" y="${labelPt.y}" fill="rgba(255, 255, 255, 0.75)" font-size="9" text-anchor="middle" dominant-baseline="middle" font-family="'Plus Jakarta Sans', sans-serif">
                    ${s.name}
                </text>
            `;
        }).join('');

        // Polygons
        const targetPoints = this.getPolygonPoints('target');
        const currentPoints = this.getPolygonPoints('current');

        this.container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center;">
                <svg width="${this.size}" height="${this.size}" viewBox="0 0 ${this.size} ${this.size}">
                    <!-- Background Glow -->
                    <defs>
                        <linearGradient id="radarTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.35"/>
                            <stop offset="100%" stop-color="#E01E5A" stop-opacity="0.2"/>
                        </linearGradient>
                        <linearGradient id="radarCurrentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.4"/>
                            <stop offset="100%" stop-color="#A78BFA" stop-opacity="0.25"/>
                        </linearGradient>
                    </defs>

                    ${rings}
                    ${axes}

                    <!-- Target Role Benchmark Polygon -->
                    <polygon id="radar-target-poly" points="${targetPoints}" fill="url(#radarTargetGrad)" stroke="#D4AF37" stroke-width="1.8" stroke-dasharray="4 3" opacity="0.85" />

                    <!-- Current Returner Competency Polygon -->
                    <polygon id="radar-current-poly" points="${currentPoints}" fill="url(#radarCurrentGrad)" stroke="#E01E5A" stroke-width="2.2" style="transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);" />

                    <!-- Center point -->
                    <circle cx="${this.center}" cy="${this.center}" r="3" fill="#D4AF37"/>
                </svg>

                <div style="display:flex; gap:1.2rem; font-size:0.75rem; margin-top:0.4rem; justify-content:center;">
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                        <span style="display:inline-block; width:10px; height:10px; background:#E01E5A; border-radius:2px;"></span>
                        <span style="color:rgba(255,255,255,0.8);">Current Skills</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:0.4rem;">
                        <span style="display:inline-block; width:10px; height:10px; background:#D4AF37; border-radius:2px;"></span>
                        <span style="color:var(--gold-light);">Target BTP Benchmark</span>
                    </div>
                </div>

                <button id="btn-simulate-bridge" class="btn-luxury-gold" style="margin-top:1.2rem; width:100%; justify-content:center; font-size:0.82rem; padding:0.6rem 1rem;">
                    <span>⚡</span> Simulate Completing SAP-BTP-401
                </button>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const bridgeBtn = document.getElementById('btn-simulate-bridge');
        if (!bridgeBtn) return;

        bridgeBtn.addEventListener('click', () => {
            if (typeof SoundFx !== 'undefined') SoundFx.success();

            if (!this.isBridged) {
                // Bridge the gaps
                this.skills[1].current = 94; // SAP BTP & CAP bridged
                this.skills[2].current = 82; // GenAI bridged
                this.isBridged = true;

                const poly = document.getElementById('radar-current-poly');
                if (poly) {
                    poly.setAttribute('points', this.getPolygonPoints('current'));
                    poly.setAttribute('stroke', '#10B981');
                }

                // Update UI scores
                const readinessEl = document.getElementById('candidate-readiness-percent');
                if (readinessEl) readinessEl.textContent = '94%';

                bridgeBtn.innerHTML = '<span>✓</span> SAP-BTP-401 Verified & Bridged!';
                bridgeBtn.classList.remove('btn-luxury-gold');
                bridgeBtn.classList.add('btn-glass-subtle');
                bridgeBtn.style.color = '#10B981';

                if (typeof showToast === 'function') {
                    showToast('SAP-BTP-401 Micro-Credential completed! Readiness boosted to 94%.', 'success');
                }
            } else {
                // Reset
                this.skills[1].current = 75;
                this.skills[2].current = 40;
                this.isBridged = false;

                const poly = document.getElementById('radar-current-poly');
                if (poly) {
                    poly.setAttribute('points', this.getPolygonPoints('current'));
                    poly.setAttribute('stroke', '#E01E5A');
                }

                const readinessEl = document.getElementById('candidate-readiness-percent');
                if (readinessEl) readinessEl.textContent = '89%';

                bridgeBtn.innerHTML = '<span>⚡</span> Simulate Completing SAP-BTP-401';
                bridgeBtn.classList.remove('btn-glass-subtle');
                bridgeBtn.classList.add('btn-luxury-gold');
                bridgeBtn.style.color = '#12071B';
            }
        });
    }
}
