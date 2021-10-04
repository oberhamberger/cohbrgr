import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';

const NotFound: FunctionComponent = () => {
    return (
        <>
            <main>
                <h1>Not Found</h1>
            </main>
            <nav>
                <ul>
                    <li>
                        <Link to="/">return</Link>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default NotFound;
