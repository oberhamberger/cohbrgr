import { FunctionComponent } from 'react';
import { Link } from 'react-router';

import { HttpStatus } from 'src/client/contexts/http';

import { Navigation } from '@cohbrgr/components';

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

NotFound.displayName = 'NotFound';

export default NotFound;
