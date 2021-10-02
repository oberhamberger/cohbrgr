import React, { FunctionComponent } from 'react';
import 'src/client/components/nav/nav.module.css';

const Nav: FunctionComponent = () => {
    return (
        <nav>
            <ul>
                <li>
                    <a href="https://twitter.com/cohbrgr">Twitter</a>
                </li>
                <li>
                    <a href="https://github.com/oberhamberger">Github</a>
                </li>
                <li>
                    <a href="https://www.linkedin.com/in/oberhamberger/">
                        LinkedIn
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Nav;
