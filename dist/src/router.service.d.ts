import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from './router.model';
export declare class Router {
    private internalRouter;
    constructor(internalRouter: InternalRouter);
    getCurrentRoute(): ICurrentRoute;
    navigateTo(path: string, state?: Record<string, unknown>): void;
    static registerRoutes(routes: Array<Route>, preloadAllRoutes?: boolean, isHashBasedRouting?: boolean): void;
}
