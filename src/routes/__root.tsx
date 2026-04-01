import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { RouterContext } from '../router';
import Navbar from '../components/layout/Navbar'
import { Toaster } from 'react-hot-toast';
import NotFound from '../components/layout/NotFound';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import ErrorPage from '../components/layout/Error';

type ErrorComponentProps = {
    error: unknown;
};

const getErrorMessage = (error: unknown): string => {
    //* Native JS error
    if (error instanceof Error) {
        return error.message;
    }

    //* TanStack often throws anything (string, object, etc.)
    if (typeof error === "string") {
        return error;
    }

    //* Custom API error shape 
    if (
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof (error).message === "string"
    ) {
        return (error).message;
    }

    return "Something went wrong";
};

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <Navbar />
            <Outlet />
            <Toaster />
            <TanStackRouterDevtools />
        </>
    ),
    pendingComponent: () => <LoadingSpinner />,
    notFoundComponent: () => <NotFound />,
    errorComponent: ({ error }: ErrorComponentProps) => <ErrorPage text={getErrorMessage(error)} />
});
