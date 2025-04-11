export default () => async (req, res, next) => {
    const renderer = (await import('./middleware/render')).default;
    return renderer(true, true)(req, res, next);
};
