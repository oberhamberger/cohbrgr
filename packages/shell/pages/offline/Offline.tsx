import { FunctionComponent } from 'react';
import Navigation from 'packages/shell/components/navigation';

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
