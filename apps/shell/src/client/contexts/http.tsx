import { createContext, ReactElement, ReactNode, useContext } from 'react';

export type HttpContextData = {
    statusCode?: number;
    redirectLocation?: string;
};

type ProviderProps = {
    children?: ReactElement;
    context: HttpContextData;
};

export const HttpContext = createContext<HttpContextData | null>(null);

export const HttpProvider = ({ children, context }: ProviderProps) => {
    return (
        <HttpContext.Provider value={context}>{children}</HttpContext.Provider>
    );
};

/**
 * Sets the HTTP status code during SSR via shared context mutation.
 *
 * This component directly mutates the HttpContext object during render,
 * which the SSR middleware reads in the `onAllReady` callback. This is
 * safe because:
 *
 * 1. The render middleware uses `onAllReady` (not `onShellReady`), so the
 *    status code is only read after all Suspense boundaries have resolved.
 * 2. This component must NOT be placed inside a Suspense boundary — doing
 *    so could cause the status code to be set by a render attempt that React
 *    later discards during fallback resolution.
 *
 * On the client side, the mutation is harmless (no server response to set).
 */
export function HttpStatus({
    code,
    children,
}: {
    code: Readonly<number>;
    children?: Readonly<ReactNode>;
}) {
    const ctx = useContext(HttpContext);
    if (ctx) ctx.statusCode = code;
    return <>{children}</>;
}
