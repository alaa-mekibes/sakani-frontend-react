import { createRouter } from '@tanstack/react-router';
import type { IUser } from './interfaces';
import { routeTree } from './routeTree.gen';
import LoadingSpinner from './components/layout/LoadingSpinner';
import NotFound from './components/layout/NotFound';
import ErrorPage from './components/layout/Error';
import { getErrorMessage } from './utils';

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
  defaultViewTransition: true, // smooth transition
  defaultPendingMs: 100, // when show pending comp
  defaultPendingMinMs: 300, // when finish pending comp
  defaultPendingComponent: () => <LoadingSpinner />,
  defaultNotFoundComponent: () => <NotFound />,
  defaultErrorComponent: ({ error }) => <ErrorPage text={getErrorMessage(error)} />,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default router;
