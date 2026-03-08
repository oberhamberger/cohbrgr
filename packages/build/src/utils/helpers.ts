/**
 * Checks if the given argument(s) exist in the process.argv array.
 */
export const findProcessArgs = (searchArgs: string | string[]): boolean => {
    return (
        process.argv.filter(
            (arg) => arg === searchArgs || searchArgs.toString().includes(arg),
        ).length > 0
    );
};
