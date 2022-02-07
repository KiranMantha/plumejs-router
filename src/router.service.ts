//https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
import { Injectable } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from './router.model';
import { StaticRouter } from './staticRouter';

@Injectable({ deps: [InternalRouter] })
export class Router {
  constructor(private internalRouter: InternalRouter) {}

  getCurrentRoute(): ICurrentRoute {
    return this.internalRouter.getCurrentRoute();
  }

  navigateTo(path: string, state?: Record<string, any>) {
    this.internalRouter.navigateTo(path, state);
  }

  static registerRoutes(routes: Array<Route>, preloadAllRoutes = false) {
    if (Array.isArray(routes)) {
      for (const route of routes) {
        StaticRouter.formatRoute(route);
      }
      preloadAllRoutes && StaticRouter.preloadRoutes();
    } else {
      throw Error('router.addRoutes: the parameter must be an array');
    }
  }
}
