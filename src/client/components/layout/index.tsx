import React, { FunctionComponent } from 'react';
import Style from 'src/client/components/layout/layout.module.scss';

const Navigation: FunctionComponent = ({ children }) => {
    return <div className={Style.layout}>{children}</div>;
};

export default Navigation;
