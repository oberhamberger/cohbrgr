import React, { FunctionComponent } from 'react';
import Style from 'src/client/components/navigation/navigation.module.scss';

const Navigation: FunctionComponent = ({ children }) => {
    const navigationNodes = React.Children.map(children, (child) => {
        return <li>{child}</li>;
    });

    return (
        <nav className={Style.navigation}>
            <ul>{navigationNodes}</ul>
        </nav>
    );
};

export default Navigation;
