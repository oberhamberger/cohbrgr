import { FunctionComponent } from 'react';

import { Navigation } from '@cohbrgr/components';

const Offline: FunctionComponent = () => {
    return (
        <>
            <main>
                <h1>You are Offline!</h1>
                <p>Come back whenever you are ready :)</p>
            </main>
            {/* Deliberately not ApiNavigation. This page is the service
                worker's offline fallback, so it has to render with no network
                at all — fetching its own nav would defeat the purpose. */}
            <Navigation>
                <a href="">refresh</a>
            </Navigation>
        </>
    );
};

Offline.displayName = 'Offline';

export default Offline;
