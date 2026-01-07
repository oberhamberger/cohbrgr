import { FunctionComponent } from 'react';

import Content from 'src/client/components/content';
import { IContent } from 'src/client/components/content/Content';

const App: FunctionComponent<IContent> = ({ nonce }) => {
    return <Content nonce={nonce} />;
};

App.displayName = 'App';

export default App;
