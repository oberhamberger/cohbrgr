import { FunctionComponent } from 'react';
import styles from 'src/client/components/spinner/Spinner.module.scss';

const Spinner: FunctionComponent = () => {
    return (
        <div className={styles.ripple}>
            <div></div>
            <div></div>
        </div>
    );
};

Spinner.displayName = 'Spinner';

export default Spinner;
