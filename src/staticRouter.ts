import { InternalRouteItem, Route } from './router.model';

export class StaticRouter {
  static routeList: Array<InternalRouteItem> = [];

  static checkParams(pathTemplate: string, pathInstance: string, params: string[]) {
    const regex = new RegExp(pathTemplate.replace(/:[^/]+/g, '([^/]+)'));
    const match = pathInstance.match(regex);

    const paramsObj = {};
    for (let i = 0; i < params.length; i++) {
      paramsObj[params[i].replace(':', '')] = match[i + 1];
    }
    return paramsObj;
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
      preload: route.preload,
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

  static preloadSelectedRoutes() {
    const filteredRoutes = StaticRouter.routeList.filter((route) => route.preload === true);
    for (const route of filteredRoutes) {
      route.templatePath && route.templatePath();
    }
  }
}
