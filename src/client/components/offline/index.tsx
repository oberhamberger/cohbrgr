import React, { FunctionComponent } from 'react';

const Offline: FunctionComponent = () => {
    return (
        <>
            <main>
                <h1>You are Offline!</h1>
                <p>Come back whenever you are ready :)</p>
            </main>
            <nav>
                <ul>
                    <li>
                        <a href="">refresh</a>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Offline;
