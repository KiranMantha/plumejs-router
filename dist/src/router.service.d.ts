import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from './router.model';
export declare class Router {
    private internalRouter;
    constructor(internalRouter: InternalRouter);
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path: string, state?: Record<string, unknown>): void;
    onNavigationEnd(): {
        subscribe: (fn: (param?: unknown) => void) => () => void;
    };
    static registerRoutes({ routes, preloadAllRoutes, isHashBasedRouting }: {
        routes: Array<Route>;
        preloadAllRoutes?: boolean;
        isHashBasedRouting?: boolean;
    }): void;
}
