import * as styles from 'src/client/components/layout/Layout.module.scss';

import { FunctionComponent, ReactNode } from 'react';

interface ILayout {
    children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};

Layout.displayName = 'Layout';

export default Layout;
