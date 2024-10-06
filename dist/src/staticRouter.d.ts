import { InternalRouteItem, Route } from './router.model';
export declare class StaticRouter {
    static routeList: Array<InternalRouteItem>;
    static formatRoute(route: Route): void;
    static preloadRoutes(): void;
    static preloadSelectedRoutes(): void;
}
