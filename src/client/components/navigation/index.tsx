import React, { FunctionComponent, ReactNode } from 'react';
import styles from 'src/client/components/navigation/navigation.module.scss';

interface INavigation {
    children: ReactNode;
}

const Navigation: FunctionComponent<INavigation> = ({ children }) => {
    const navigationNodes = React.Children.map(children, (child) => {
        return <li>{child}</li>;
    });

    return (
        <nav className={styles.navigation}>
            <ul>{navigationNodes}</ul>
        </nav>
    );
};

Navigation.displayName = 'Navigation';

export default Navigation;
