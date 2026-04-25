import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { RouterContext } from '../router';
import Navbar from '../components/layout/Navbar'
import { Toaster } from 'react-hot-toast';

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => (
        <>
            <Navbar />
            <Outlet />
            <Toaster />
            <TanStackRouterDevtools />
        </>
    ),
   
});
