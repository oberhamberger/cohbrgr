import { FunctionComponent, useEffect, useRef } from 'react';

import * as styles from 'src/client/components/guilloche/Guilloche.module.scss';

/** Concentric passes. More reads as finer engraving, and costs almost nothing. */
const RINGS = 96;
/** Every sixth pass is cut deeper, the way an index ring is on a real dial. */
const INDEX_EVERY = 6;

/**
 * Draws the ground: guilloché, the pattern a rose engine cuts into a watch dial
 * by modulating its radius as it turns. Two summed harmonics per pass, which is
 * enough for the passes to interfere with each other and produce the moiré the
 * eye actually reads — no single line is visible, the pattern between them is.
 *
 * Decorative, so it is aria-hidden and never server-rendered. Without JavaScript
 * the page is exactly what it was before: a flat ground.
 */
const Guilloche: FunctionComponent = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const draw = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            // Two is enough. Beyond it the cost doubles and nothing looks better.
            const ratio = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = width * ratio;
            canvas.height = height * ratio;
            context.setTransform(ratio, 0, 0, ratio, 0, 0);
            context.clearRect(0, 0, width, height);

            // The engraving colour follows the theme by reading the text colour,
            // so this needs no palette of its own and no duplicate dark-mode block.
            const ink = getComputedStyle(document.documentElement)
                .getPropertyValue('--color-font')
                .trim();

            // Off to the right and low, so the centre of the pattern sits outside
            // the reading column instead of behind it.
            const centreX = width * 0.78;
            const centreY = height * 0.62;
            const spacing = Math.max(width, height) / 58;

            // The wobble is a function of arc length, not of angle. Driving it
            // from the angle alone makes the lobe count constant, so the waves
            // stretch as the radius grows and the outer field turns into lazy
            // curves instead of engraving. Arc length holds the wavelength even
            // across the whole plate, which is what a rose engine actually cuts.
            // One clean wave, not two. Competing harmonics read as noise; a
            // single sine whose phase advances a fixed amount per pass is what
            // produces the woven diagonals the pattern is known for.
            const wavelength = spacing * 3.1;
            const amplitude = spacing * 0.34;
            const phasePerRing = 0.55;

            context.lineWidth = 0.6;

            for (let ring = 0; ring < RINGS; ring++) {
                const base = spacing * 0.9 + ring * spacing;
                context.beginPath();

                // Finer angular sampling further out, so the outer passes do not
                // go polygonal where each step covers more distance.
                const step = base > spacing * 26 ? 0.6 : 1.2;

                for (let degree = 0; degree <= 360; degree += step) {
                    const angle = (degree * Math.PI) / 180;
                    const arc = angle * base;
                    const wobble =
                        Math.sin(
                            (arc / wavelength) * Math.PI * 2 +
                                ring * phasePerRing,
                        ) * amplitude;
                    const radius = base + wobble;
                    const x = centreX + Math.cos(angle) * radius * 1.18;
                    const y = centreY + Math.sin(angle) * radius;
                    if (degree === 0) {
                        context.moveTo(x, y);
                    } else {
                        context.lineTo(x, y);
                    }
                }

                context.closePath();
                context.globalAlpha = ring % INDEX_EVERY === 0 ? 0.1 : 0.055;
                context.strokeStyle = ink;
                context.stroke();
            }

            context.globalAlpha = 1;
        };

        draw();

        // Redraw on resize, and when the viewer switches theme, because the
        // engraving colour is read from the stylesheet at draw time.
        const scheme = window.matchMedia('(prefers-color-scheme: dark)');
        window.addEventListener('resize', draw);
        scheme.addEventListener('change', draw);

        return () => {
            window.removeEventListener('resize', draw);
            scheme.removeEventListener('change', draw);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={styles.guilloche}
            aria-hidden="true"
        />
    );
};

Guilloche.displayName = 'Guilloche';

export default Guilloche;
