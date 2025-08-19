import { FunctionComponent, ReactNode } from 'react';

import * as styles from 'src/client/components/layout/Layout.module.scss';

interface ILayout {
    children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};

Layout.displayName = 'Layout';

export default Layout;
