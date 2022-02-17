import React, { FunctionComponent } from 'react';
import styles from 'src/client/components/layout/layout.module.scss';

const Layout: FunctionComponent = ({ children }) => {
    return <div className={styles.layout}>{children}</div>;
};

Layout.displayName = 'Layout';

export default Layout;
