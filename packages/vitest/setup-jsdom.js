// Registers the jest-dom matchers (toBeInTheDocument, toHaveAttribute, ...)
// against Vitest's expect. Applied automatically to every jsdom project by
// defineProject, so individual spec files no longer import this themselves.
import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Testing Library only self-registers its afterEach(cleanup) when a global
// afterEach exists. Globals are off in this workspace, so without this each
// render would leak into the next test and queries would start reporting
// duplicate elements.
afterEach(() => {
    cleanup();
});
