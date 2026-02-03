import type { State } from 'src/client/store/state';

declare global {
    interface Window {
        __initial_state__?: State;
    }
}
