import { State } from 'packages/client/store/state';

declare global {
    interface Window {
        __initial_state__: State;
    }
}
