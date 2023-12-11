import { FunctionComponent } from 'react';
import Navigation from 'packages/shell/components/navigation';
import StructuredData from 'packages/shell/components/structured-data';

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
                <a href="https://mastodon.social/@cohbrgr">Mastodon</a>
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
