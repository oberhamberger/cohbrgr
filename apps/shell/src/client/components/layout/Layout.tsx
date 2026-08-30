import { FunctionComponent, ReactNode } from 'react';

import Guilloche from 'src/client/components/guilloche';
import * as styles from 'src/client/components/layout/Layout.module.scss';

interface ILayout {
    children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    return (
        <>
            <Guilloche />
            <div className={styles.layout}>{children}</div>
        </>
    );
};

Layout.displayName = 'Layout';

export default Layout;
