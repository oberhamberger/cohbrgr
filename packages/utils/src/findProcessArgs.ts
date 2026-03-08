/**
 * Checks if the given argument(s) exist in the process.argv array.
 */
export const findProcessArgs = (searchArgs: string | string[]): boolean => {
    const args = Array.isArray(searchArgs) ? searchArgs : [searchArgs];
    return process.argv.some((arg) => args.includes(arg));
};
