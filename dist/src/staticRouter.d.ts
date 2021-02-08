import { Route, InternalRouteItem, RouteItem, jsonObject } from './router.model';
export declare class StaticRouter {
    static routList: Array<InternalRouteItem>;
    static checkParams(up: Array<string>, r: RouteItem): jsonObject;
    static getParamCount(p: string[]): number;
    static formatRoute(r: Route): void;
}
