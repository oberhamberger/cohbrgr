import Content from 'src/client/components/content';
import { IContent } from 'src/client/components/content/Content';

import { FunctionComponent } from 'react';

const App: FunctionComponent<IContent> = ({ nonce }) => {
    return <Content nonce={nonce} />;
};

App.displayName = 'App';

export default App;
