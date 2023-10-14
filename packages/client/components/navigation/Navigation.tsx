import { FunctionComponent, ReactNode, Children } from 'react';
import styles from 'packages/client/components/navigation/Navigation.module.scss';

interface INavigation {
    children: ReactNode;
}

const Navigation: FunctionComponent<INavigation> = ({ children }) => {
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
