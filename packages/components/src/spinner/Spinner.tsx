import { FunctionComponent } from 'react';
import * as styles from 'src/spinner/Spinner.module.scss';

export const Spinner: FunctionComponent = () => {
    return (
        <div className={styles.ripple} data-testid="spinner">
            <div></div>
            <div></div>
        </div>
    );
};

Spinner.displayName = 'Spinner';

export default Spinner;
