import { FunctionComponent } from 'react';
// import styles from './Spinner.module.scss';

export const Spinner: FunctionComponent = () => {
    return (
        <div data-testid="spinner">
            <div></div>
            <div></div>
        </div>
    );
};

Spinner.displayName = 'Spinner';

export default Spinner;
