import { Observable } from 'rxjs';

interface ICurrentRoute {
  path: string;
  params: { [key: string]: string | number | boolean };
  state: Record<string, any>;
}

interface RouteItem {
  Params: any;
  Url: string;
  Template: string;
  ParamCount: number;
}

interface Route {
  path: string;
  template?: string;
  templatePath?: () => Promise<any>;
  redirectTo?: string;
  canActivate?: () => Observable<boolean> | Promise<boolean> | boolean;
}

interface InternalRouteItem extends RouteItem {
  IsRegistered?: boolean;
  TemplatePath?: () => Promise<any>;
  redirectTo?: string;
  canActivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

export { Route, RouteItem, ICurrentRoute, InternalRouteItem };
