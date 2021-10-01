import React, { FunctionComponent } from 'react';

const App: FunctionComponent = (props: any) => {
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
            <nav>
                <ul>
                    <li>
                        <a href="https://twitter.com/cohbrgr">Twitter</a>
                    </li>
                    <li>
                        <a href="https://github.com/oberhamberger">Github</a>
                    </li>
                    <li>
                        <a href="https://www.linkedin.com/in/oberhamberger/">
                            LinkedIn
                        </a>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default App;
