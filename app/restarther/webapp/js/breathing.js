/**
 * RestartHER - Mindful 4-7-8 Returner Breathing Guide
 * Therapeutic anxiety de-escalation for women returning to high-stakes tech environments
 */

class BreathingGuide {
    constructor(modalId, triggerBtnId) {
        this.modal = document.getElementById(modalId);
        this.triggerBtn = document.getElementById(triggerBtnId);
        this.timer = null;
        this.phase = 'idle'; // 'inhale' | 'hold' | 'exhale'
        this.remaining = 0;

        if (this.triggerBtn) {
            this.triggerBtn.addEventListener('click', () => this.open());
        }
        const closeBtn = document.getElementById('btn-close-breathing-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        if (typeof SoundFx !== 'undefined') SoundFx.zen();
        this.startCycle();
    }

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        if (this.timer) clearInterval(this.timer);
    }

    startCycle() {
        const textEl = document.getElementById('breathing-instruction-text');
        const countEl = document.getElementById('breathing-countdown');
        const orbEl = document.getElementById('breathing-orb');

        const runPhase = (phaseName, durationSec, instruction, orbScale, nextFn) => {
            this.phase = phaseName;
            this.remaining = durationSec;
            if (textEl) textEl.textContent = instruction;
            if (countEl) countEl.textContent = this.remaining;
            if (orbEl) orbEl.style.transform = `scale(${orbScale})`;

            if (this.timer) clearInterval(this.timer);
            this.timer = setInterval(() => {
                this.remaining--;
                if (countEl) countEl.textContent = this.remaining;
                if (this.remaining <= 0) {
                    clearInterval(this.timer);
                    nextFn();
                }
            }, 1000);
        };

        const stepInhale = () => {
            runPhase('inhale', 4, 'Inhale Confidence & Architectural Clarity (4s)', 1.45, stepHold);
        };

        const stepHold = () => {
            runPhase('hold', 7, 'Hold Calm & Grounding Stillness (7s)', 1.45, stepExhale);
        };

        const stepExhale = () => {
            runPhase('exhale', 8, 'Exhale Impostor Syndrome & Hesitation (8s)', 0.9, stepInhale);
        };

        stepInhale();
    }
}
