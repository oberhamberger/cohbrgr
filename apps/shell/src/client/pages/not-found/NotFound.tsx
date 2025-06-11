import { Navigation } from '@cohbrgr/components';
import { Link } from 'react-router-dom';
import { HttpStatus } from 'src/client/contexts/http';

import { FunctionComponent } from 'react';

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
