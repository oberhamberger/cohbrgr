import { Component, ReactNode } from 'react';
import type { ErrorInfo } from 'react';

interface IErrorBoundary {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

export class ErrorBoundary extends Component<
    IErrorBoundary,
    ErrorBoundaryState
> {
    static displayName = 'ErrorBoundary';

    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(): ErrorBoundaryState {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
