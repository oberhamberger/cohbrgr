import React, { FunctionComponent } from 'react';
import Navigation from 'src/client/components/navigation';
import StructuredData from 'src/client/components/structured-data';

const Content: FunctionComponent = () => {
    return (
        <>
            <main>
                <h1>Hi!</h1>
                <h2>My name is Christian</h2>
                <p>
                    I am a Frontend Developer at{' '}
                    <a href="https://www.netconomy.net/">Netconomy</a>. I mainly
                    work with React and Node.js on online commerce platforms.
                </p>
            </main>
            <Navigation>
                <a href="https://twitter.com/cohbrgr">Twitter</a>
                <a href="https://github.com/oberhamberger">Github</a>
                <a href="https://www.linkedin.com/in/oberhamberger/">
                    LinkedIn
                </a>
            </Navigation>
            <StructuredData />
        </>
    );
};

Content.displayName = 'Content';

export default Content;
