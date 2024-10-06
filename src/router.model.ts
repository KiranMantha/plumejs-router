import type { Observable } from 'rxjs';

export interface CurrentRoute {
  path: string;
  routeParams: Record<string, string | number | boolean>;
  queryParams: Record<string, string | number | boolean>;
  state: Record<string, unknown>;
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

export interface InternalRouteItem {
  params: string[];
  path: string;
  template: string;
  paramCount: number;
  fragments: string[];
  isRegistered?: boolean;
  redirectTo?: string;
  preload?: boolean;
  templatePath?: () => Promise<unknown>;
  canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
