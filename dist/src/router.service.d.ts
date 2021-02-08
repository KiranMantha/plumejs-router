import { Route, ICurrentRoute } from "./router.model";
import { InternalRouter } from './internalRouter.service';
export declare class Router {
    getCurrentRoute: () => ICurrentRoute;
    navigateTo: (path: string) => void;
    constructor(internalRouter: InternalRouter);
    static registerRoutes(routes: Array<Route>): void;
}
