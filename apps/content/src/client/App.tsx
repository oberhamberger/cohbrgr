import { FunctionComponent } from 'react';
import Layout from 'src/client/components/layout';
import Content from 'src/client/components/content';
import { IContent } from 'src/client/components/content/Content';

const App: FunctionComponent<IContent> = ({ nonce }) => {
    return <Layout><Content nonce={nonce} /></Layout>;
};

App.displayName = 'App';

export default App;
