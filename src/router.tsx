import { createRouter } from '@tanstack/react-router';
import type { IUser } from './interfaces';
import { routeTree } from './routeTree.gen';

export interface RouterContext {
    user: IUser | null;
    isAuthenticated: boolean;
}

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: {
        user: null,
        isAuthenticated: false,
    } as RouterContext,

});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default router;
