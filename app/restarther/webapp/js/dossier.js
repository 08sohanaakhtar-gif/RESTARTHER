/**
 * RestartHER - SAP Returner Dossier & BTP Connectors Inspector
 */

class DossierEngine {
    constructor() {
        this.init();
    }

    init() {
        const openDossierBtn = document.getElementById('btn-view-dossier');
        const dossierModal = document.getElementById('dossier-modal');
        const closeDossierBtn = document.getElementById('btn-close-dossier-modal');

        if (openDossierBtn && dossierModal) {
            openDossierBtn.addEventListener('click', () => {
                if (typeof SoundFx !== 'undefined') SoundFx.click();
                dossierModal.classList.add('active');
            });
        }

        if (closeDossierBtn && dossierModal) {
            closeDossierBtn.addEventListener('click', () => {
                dossierModal.classList.remove('active');
            });
        }

        // Connectors Inspector Drawer
        const openInspectorBtn = document.getElementById('btn-inspect-connectors');
        const inspectorDrawer = document.getElementById('connectors-drawer');
        const closeInspectorBtn = document.getElementById('btn-close-connectors-drawer');

        if (openInspectorBtn && inspectorDrawer) {
            openInspectorBtn.addEventListener('click', () => {
                if (typeof SoundFx !== 'undefined') SoundFx.click();
                inspectorDrawer.classList.add('active');
            });
        }

        if (closeInspectorBtn && inspectorDrawer) {
            closeInspectorBtn.addEventListener('click', () => {
                inspectorDrawer.classList.remove('active');
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DossierEngine();
});
