import { FunctionComponent } from 'react';
import { Link } from 'react-router';

import ApiNavigation from 'src/client/components/api-navigation';
import { HttpStatus } from 'src/client/contexts/http';

const NotFound: FunctionComponent = () => {
    return (
        <HttpStatus code={404}>
            <main>
                <h1>Not Found</h1>
            </main>

            <ApiNavigation
                nodeId="not-found"
                fallback={<Link to="/">return</Link>}
            />
        </HttpStatus>
    );
};

NotFound.displayName = 'NotFound';

export default NotFound;
