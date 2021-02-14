import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from "./router.model";
export declare class Router {
    getCurrentRoute: () => ICurrentRoute;
    navigateTo: (path: string) => void;
    constructor(internalRouter: InternalRouter);
    static registerRoutes(routes: Array<Route>): void;
}
