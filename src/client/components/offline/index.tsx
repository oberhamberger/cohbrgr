import React, { FunctionComponent } from 'react';
import styles from 'src/client/components/offline/offline.module.scss';

const Offline: FunctionComponent = () => {
    return (
        <div>
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
        </div>
    );
};

export default Offline;
