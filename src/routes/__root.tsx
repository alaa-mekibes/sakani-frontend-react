import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { RouterContext } from '../router';
import Navbar from '../components/layout/Navbar'
import { Toaster } from 'react-hot-toast';
import NotFound from '../components/layout/NotFound';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import ErrorPage from '../components/layout/Error';
import { getErrorMessage } from '../utils';

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
    errorComponent: ({ error }) => <ErrorPage text={getErrorMessage(error)} />
});
