import { Children, FunctionComponent, ReactNode } from 'react';

import * as styles from './Navigation.module.scss';

interface INavigation {
    children: ReactNode;
}

export const Navigation: FunctionComponent<INavigation> = ({ children }) => {
    const navigationNodes = Children.map(children, (child) => {
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
