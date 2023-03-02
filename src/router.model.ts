import type { Observable } from 'rxjs';

interface ICurrentRoute {
  path: string;
  routeParams: Map<string, string | number | boolean>;
  queryParams: Map<string, string | number | boolean>;
  state: Record<string, any>;
}

interface RouteItem {
  params: any;
  url: string;
  template: string;
  paramCount: number;
}

interface Route {
  path: string;
  template?: string;
  templatePath?: () => Promise<any>;
  redirectTo?: string;
  canActivate?: () => Observable<boolean> | Promise<boolean> | boolean;
}

interface InternalRouteItem extends RouteItem {
  isRegistered?: boolean;
  templatePath?: () => Promise<any>;
  redirectTo?: string;
  canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export { Route, RouteItem, ICurrentRoute, InternalRouteItem };
