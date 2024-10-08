import { InternalRouter } from './internalRouter.service';
import { Route } from './router.model';
export declare class Router {
    private internalRouter;
    constructor(internalRouter: InternalRouter);
    getCurrentRoute(): {
        subscribe: (fn: (value?: import("./router.model").CurrentRoute) => void) => () => void;
    };
    navigateTo(path: string, state?: Record<string, unknown>): void;
    onNavigationEnd(): {
        subscribe: (fn: (() => void) | ((param: unknown) => void)) => () => void;
    };
    static registerRoutes({ routes, preloadAllRoutes }: {
        routes: Array<Route>;
        preloadAllRoutes?: boolean;
    }): void;
}
