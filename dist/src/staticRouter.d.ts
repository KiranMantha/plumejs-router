import { InternalRouteItem, Route, RouteItem } from './router.model';
export declare class StaticRouter {
    static routeList: Array<InternalRouteItem>;
    static checkParams(uParams: Array<string>, routeItem: RouteItem): Record<string, any>;
    static getParamCount(params: string[]): number;
    static formatRoute(route: Route): void;
    static preloadRoutes(): void;
}
