import { createContext, useContext, ReactNode, ReactElement } from 'react';

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

export function HttpStatus({
    code,
    children,
}: {
    code: number;
    children?: ReactNode;
}) {
    // TODO: This might not work properly with suspense, figure out how to prevent adding
    // a new item for renders that aren't "committed"
    const ctx = useContext(HttpContext);
    if (ctx) ctx.statusCode = code;
    return <>{children}</>;
}
