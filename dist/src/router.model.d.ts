import type { Observable } from 'rxjs';
export interface ICurrentRoute {
    path: string;
    routeParams: Map<string, string | number | boolean>;
    queryParams: Map<string, string | number | boolean>;
    state: Record<string, any>;
}
export interface RouteItem {
    params: any;
    url: string;
    template: string;
    paramCount: number;
}
export interface Route {
    path: string;
    template?: string;
    redirectTo?: string;
    preload?: boolean;
    templatePath?: () => Promise<any>;
    canActivate?: () => Observable<boolean> | Promise<boolean> | boolean;
}
export interface InternalRouteItem extends RouteItem {
    isRegistered?: boolean;
    redirectTo?: string;
    preload?: boolean;
    templatePath?: () => Promise<any>;
    canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
