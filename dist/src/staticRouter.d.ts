import { InternalRouteItem, Route, RouteItem } from './router.model';
export declare class StaticRouter {
    static routList: Array<InternalRouteItem>;
    static checkParams(up: Array<string>, r: RouteItem): Record<string, any>;
    static getParamCount(p: string[]): number;
    static formatRoute(r: Route): void;
}
