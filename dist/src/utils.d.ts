import { CurrentRoute, InternalRouteItem } from './router.model';
export declare const getParams: (path: string) => any[];
declare const matchPath: (route: string, path: string) => boolean;
declare function matchRoute(path: string, normalizedRoutes: InternalRouteItem[]): {
    route: InternalRouteItem;
    routeData: Partial<CurrentRoute>;
} | null;
declare const PAGE_NOT_FOUND_TEMPLATE = "\n  <div style='text-align: center'>\n    <h1>404</h1>\n    <h3>not Found</h3>\n  </div>\n";
export { matchPath, matchRoute, PAGE_NOT_FOUND_TEMPLATE };
