import { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import { HttpStatus } from 'packages/client/contexts/http';
import Navigation from 'packages/client/components/navigation';

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
