import { FunctionComponent } from 'react';
import StructuredData from 'src/client/components/structured-data';

export interface IContent {
    nonce?: string | undefined;
}

const Content: FunctionComponent<IContent> = ({ nonce }) => {
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
            <StructuredData nonce={nonce} />
        </>
    );
};

Content.displayName = 'Content';

export default Content;
