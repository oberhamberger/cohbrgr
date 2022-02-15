import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { HttpStatus } from 'src/client/contexts/http';
import Navigation from 'src/client/components/navigation';

const NotFound: FunctionComponent = () => {
    return (
        <HttpStatus code={404}>
            <main>
                <h1>Not Found</h1>
            </main>

            <Navigation>
                <Link to="/">return</Link>
            </Navigation>
        </HttpStatus>
    );
};

export default NotFound;
