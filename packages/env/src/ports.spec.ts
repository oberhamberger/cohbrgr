import { ports } from './ports';

describe('ports', () => {
    it('defines shell ports', () => {
        expect(ports.shell).toEqual({ dev: 3030, prod: 3000 });
    });

    it('defines content ports', () => {
        expect(ports.content).toEqual({ dev: 3031, prod: 3001 });
    });

    it('defines api ports', () => {
        expect(ports.api).toEqual({ dev: 3032, prod: 3002 });
    });

    it('uses unique ports across all apps', () => {
        const allPorts = Object.values(ports).flatMap((p) => [p.dev, p.prod]);
        expect(new Set(allPorts).size).toBe(allPorts.length);
    });

    it('uses dev ports in the 3030 range', () => {
        Object.values(ports).forEach((p) => {
            expect(p.dev).toBeGreaterThanOrEqual(3030);
            expect(p.dev).toBeLessThan(3040);
        });
    });

    it('uses prod ports in the 3000 range', () => {
        Object.values(ports).forEach((p) => {
            expect(p.prod).toBeGreaterThanOrEqual(3000);
            expect(p.prod).toBeLessThan(3010);
        });
    });
});
