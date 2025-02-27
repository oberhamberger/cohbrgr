import { FunctionComponent } from 'react';
import { Navigation } from '@cohbrgr/components';
import StructuredData from '../structured-data';

export interface IContent {
    nonce?: string;
}

const Content: FunctionComponent<IContent> = ({ nonce }) => {
    return (
        <>
            <main>
                <p role="doc-subtitle">C.F.K.O.<br/></p>
                <h1>My name is Christian</h1>
                <p>
                    I am a Frontend Developer at{' '}
                    <a href="https://www.netconomy.net/">Netconomy</a>. I mainly
                    work with React and Node.js on online commerce platforms.
                </p>
            </main>
            <Navigation>
                <a href="https://github.com/oberhamberger">Github</a>
                <a href="https://bsky.app/profile/cohbrgr.bsky.social">Bluesky</a>
                <a href="https://www.linkedin.com/in/oberhamberger">LinkedIn</a>
            </Navigation>
            <StructuredData nonce={nonce} />
        </>
    );
};

Content.displayName = 'Content';

export default Content;
