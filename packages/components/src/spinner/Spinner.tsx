import { FunctionComponent } from 'react';
import styles from 'src/spinner/Spinner.module.scss';

export const Spinner: FunctionComponent = () => {
    return (
        <div className={styles.ripple}>
            <div></div>
            <div></div>
        </div>
    );
};

Spinner.displayName = 'Spinner';

export default Spinner;
