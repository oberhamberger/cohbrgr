import { FunctionComponent } from 'react';

const Content: FunctionComponent = () => {
    return (
        <main>
            <h1>Hi!</h1>
            <h2>My name is Christian</h2>
            <p>
                I am a Frontend Developer at{' '}
                <a href="https://www.netconomy.net/">Netconomy</a>. I mainly
                work with React and Node.js on online commerce platforms.
            </p>
        </main>
    );
};

Content.displayName = 'Content';

export default Content;
