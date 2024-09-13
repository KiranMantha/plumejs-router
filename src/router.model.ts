import type { Observable } from 'rxjs';

export interface ICurrentRoute {
  path: string;
  routeParams: Map<string, string | number | boolean>;
  queryParams: Map<string, string | number | boolean>;
  state: Record<string, unknown>;
}

export interface RouteItem {
  params: string[];
  url: string;
  template: string;
  paramCount: number;
}

export interface Route {
  path: string;
  template?: string;
  redirectTo?: string;
  preload?: boolean;
  children?: Route[];
  templatePath?: () => Promise<unknown>;
  canActivate?: () => Observable<boolean> | Promise<boolean> | boolean;
}

export interface InternalRouteItem extends RouteItem {
  fragments: string[];
  isRegistered?: boolean;
  redirectTo?: string;
  preload?: boolean;
  templatePath?: () => Promise<unknown>;
  canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
