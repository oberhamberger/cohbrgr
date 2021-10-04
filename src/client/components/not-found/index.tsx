import React, { FunctionComponent } from 'react';
import { Route, Link } from 'react-router-dom';

type StatusProps = {
    code: number;
};
const Status: FunctionComponent<StatusProps> = (props) => {
    return (
        <Route
            render={({ staticContext }) => {
                if (staticContext) {
                    staticContext.statusCode = props.code;
                }
                return props.children;
            }}
        />
    );
};

const NotFound: FunctionComponent = () => {
    return (
        <Status code={404}>
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
        </Status>
    );
};

export default NotFound;
