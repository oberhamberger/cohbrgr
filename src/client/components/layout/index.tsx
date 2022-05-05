import React, { FunctionComponent, ReactNode } from 'react';
import styles from 'src/client/components/layout/layout.module.scss';

interface ILayout {
    children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};

Layout.displayName = 'Layout';

export default Layout;
