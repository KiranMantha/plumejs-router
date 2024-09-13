import { InternalRouteItem, Route } from './router.model';
import { getParams } from './utils';

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

  static formatRoute(route: Route) {
    const internalRouteItem: InternalRouteItem = {
      fragments: [],
      params: getParams(route.path),
      url: route.path,
      template: '',
      paramCount: 0,
      isRegistered: false,
      redirectTo: route.redirectTo,
      preload: route.preload,
      canActivate: () => true
    };
    internalRouteItem.fragments = route.path.split('/').filter((str) => {
      return str.length > 0;
    });
    if (route.template) {
      if (!route.templatePath) throw Error('templatePath is required in route if template is mentioned.');
      internalRouteItem.template = route.template;
      internalRouteItem.templatePath = route.templatePath;
    }
    if (route.canActivate) internalRouteItem.canActivate = route.canActivate;
    internalRouteItem.paramCount = internalRouteItem.params.length;
    StaticRouter.routeList.push(internalRouteItem);
  }

  static preloadRoutes() {
    for (const route of StaticRouter.routeList) {
      if (route.templatePath) route.templatePath();
    }
  }

  static preloadSelectedRoutes() {
    const filteredRoutes = StaticRouter.routeList.filter((route) => route.preload === true);
    for (const route of filteredRoutes) {
      if (route.templatePath) route.templatePath();
    }
  }
}
