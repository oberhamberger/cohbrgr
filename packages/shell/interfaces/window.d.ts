import { State } from 'packages/shell/store/state';

declare global {
    interface Window {
        __initial_state__: State;
    }
}
