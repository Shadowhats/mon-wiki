/* ShadowHats Wiki — JavaScript additionnel
 * Améliorations légères : confort de lecture mobile + petits raffinements.
 * Pas de dépendance, pas de tracking.
 */

(function () {
    'use strict';

    /* ----------------------------------------------------------
     * 1. Ajouter target="_blank" + rel sur les liens externes
     * ---------------------------------------------------------- */
    function enhanceExternalLinks() {
        const host = window.location.hostname;
        document.querySelectorAll('.md-content a[href^="http"]').forEach((a) => {
            try {
                const url = new URL(a.href);
                if (url.hostname && url.hostname !== host) {
                    if (!a.hasAttribute('target')) a.target = '_blank';
                    a.rel = 'noopener noreferrer';
                }
            } catch (e) { /* ignore */ }
        });
    }

    /* ----------------------------------------------------------
     * 2. Améliorer le scroll horizontal des tables sur mobile :
     *    ajouter un petit indicateur visuel "← scroll →" si la table
     *    déborde, qui disparaît au premier scroll.
     * ---------------------------------------------------------- */
    function tagScrollableTables() {
        if (window.innerWidth > 768) return;
        document.querySelectorAll('.md-typeset table:not([class])').forEach((tbl) => {
            if (tbl.scrollWidth > tbl.clientWidth && !tbl.dataset.scrollHinted) {
                tbl.dataset.scrollHinted = '1';
                const hint = document.createElement('div');
                hint.className = 'shadow-scroll-hint';
                hint.textContent = '⇆ scroll horizontal';
                hint.style.cssText = 'font-family: var(--shadow-font-mono, monospace); ' +
                                    'font-size: 0.7rem; opacity: 0.6; ' +
                                    'text-align: right; margin: 0.3rem 0 -0.2rem; ' +
                                    'color: var(--shadow-green, #9fef00);';
                tbl.parentNode.insertBefore(hint, tbl);
                tbl.addEventListener('scroll', () => hint.remove(), { once: true, passive: true });
            }
        });
    }

    /* ----------------------------------------------------------
     * 3. Run au chargement + après navigation interne (instant nav)
     * ---------------------------------------------------------- */
    function run() {
        enhanceExternalLinks();
        tagScrollableTables();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run);
    } else {
        run();
    }

    // Material instant navigation : re-jouer après chaque changement de page
    document.addEventListener('DOMContentSwitch', run);

    // Recalculer si l'utilisateur tourne son téléphone
    window.addEventListener('resize', () => {
        clearTimeout(window.__shadowResize);
        window.__shadowResize = setTimeout(tagScrollableTables, 200);
    });
})();
