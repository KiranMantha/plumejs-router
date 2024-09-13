import { InternalRouteItem, Route } from './router.model';
export declare class StaticRouter {
    static routeList: Array<InternalRouteItem>;
    static checkParams(pathTemplate: string, pathInstance: string, params: string[]): {};
    static formatRoute(route: Route): void;
    static preloadRoutes(): void;
    static preloadSelectedRoutes(): void;
}
