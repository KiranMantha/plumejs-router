import { InternalRouteItem, Route, RouteItem } from './router.model';

export class StaticRouter {
  static routeList: Array<InternalRouteItem> = [];

  static checkParams(urlParams: Array<string>, routeItem: RouteItem) {
    let paramMapCount = 0;
    const paramsObject: Record<string, any> = {},
      paramCount = routeItem.paramCount;

    for (let i = 0; i < urlParams.length; i++) {
      const routeParam = routeItem.params[i];
      if (routeParam.indexOf(':') >= 0) {
        paramsObject[routeParam.split(':')[1]] = urlParams[i].split('?')[0];
        paramMapCount += 1;
      }
    }
    if (paramMapCount === paramCount) {
      return paramsObject;
    }
    return {};
  }

  static getParamCount(params: string[]) {
    let paramCount = 0;
    params.forEach((param) => {
      if (param.indexOf(':') >= 0) {
        paramCount += 1;
      }
    });
    return paramCount;
  }

  static formatRoute(route: Route) {
    const internalRouteItem: InternalRouteItem = {
      params: {},
      url: '',
      template: '',
      paramCount: 0,
      isRegistered: false,
      redirectTo: '',
      canActivate: () => true
    };
    internalRouteItem.params = route.path.split('/').filter((str: string) => {
      return str.length > 0;
    });
    internalRouteItem.url = route.path;
    internalRouteItem.template = '';
    internalRouteItem.redirectTo = route.redirectTo;
    if (route.template) {
      if (!route.templatePath) throw Error('templatePath is required in route if template is mentioned.');
      internalRouteItem.template = route.template;
      internalRouteItem.templatePath = route.templatePath;
    }
    if (route.canActivate) internalRouteItem.canActivate = route.canActivate;
    internalRouteItem.paramCount = StaticRouter.getParamCount(internalRouteItem.params);
    StaticRouter.routeList.push(internalRouteItem);
  }

  static preloadRoutes() {
    for (const route of StaticRouter.routeList) {
      route.templatePath && route.templatePath();
    }
  }
}
