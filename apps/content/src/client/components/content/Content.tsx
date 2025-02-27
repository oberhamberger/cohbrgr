import { FunctionComponent } from 'react';
import StructuredData from 'src/client/components/structured-data';

export interface IContent {
    nonce?: string | undefined;
}

const Content: FunctionComponent<IContent> = ({ nonce }) => {
    return (
        <>
            <main>
                <p role="doc-subtitle">C.F.K.O<br/></p>
                <h1>My name is Christian</h1>
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
