const createRenderThunk: RenderThunk = () => async (req, res) => {
    const renderer = (await import('renderMiddleware')).default as unknown as RenderMiddlewareFactory;
    return renderer(true, true)(req, res);
};

export default createRenderThunk;
