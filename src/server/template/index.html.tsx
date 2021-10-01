import React, { FunctionComponent } from 'react';

const Index: FunctionComponent = (props) => {
    return (
        <html lang="en">
            <head>
                <title>Test</title>
            </head>
            <body>{props.children}</body>
        </html>
    );
};

export default Index;
