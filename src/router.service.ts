//https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url
import { Injectable } from '@plumejs/core';
import { isNode } from 'browser-or-node';
import { InternalRouter } from './internalRouter.service';
import { ICurrentRoute, Route } from './router.model';
import { StaticRouter } from './staticRouter';

@Injectable()
export class Router {
  constructor(private internalRouter: InternalRouter) {}

  getCurrentRoute(): ICurrentRoute {
    return this.internalRouter.getCurrentRoute();
  }

  navigateTo(path: string) {
    this.internalRouter.navigateTo(path);
  }

  static registerRoutes(routes: Array<Route>) {
    if (!isNode) {
      if (Array.isArray(routes)) {
        for (const route of routes) {
          StaticRouter.formatRoute(route);
        }
      } else {
        throw Error('router.addRoutes: the parameter must be an array');
      }
    }
  }
}
