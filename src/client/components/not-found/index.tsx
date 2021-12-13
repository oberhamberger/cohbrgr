import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { HttpStatus } from 'src/server/utils/http/context';

const NotFound: FunctionComponent = () => {
    return (
        <HttpStatus code={404}>
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
        </HttpStatus>
    );
};

export default NotFound;
