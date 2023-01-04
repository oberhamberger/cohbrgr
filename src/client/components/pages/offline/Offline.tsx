import React, { FunctionComponent } from 'react';
import Navigation from 'src/client/components/navigation';

const Offline: FunctionComponent = () => {
    return (
        <>
            <main>
                <h1>You are Offline!</h1>
                <p>Come back whenever you are ready :)</p>
            </main>
            <Navigation>
                <a href="">refresh</a>
            </Navigation>
        </>
    );
};

Offline.displayName = 'Offline';

export default Offline;
