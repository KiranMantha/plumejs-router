import { Injectable } from '@plumejs/core';
import { isNode } from 'browser-or-node';
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';
export class Router {
    internalRouter;
    constructor(internalRouter) {
        this.internalRouter = internalRouter;
    }
    getCurrentRoute() {
        return this.internalRouter.getCurrentRoute();
    }
    navigateTo(path) {
        this.internalRouter.navigateTo(path);
    }
    static registerRoutes(routes) {
        if (!isNode) {
            if (Array.isArray(routes)) {
                for (const route of routes) {
                    StaticRouter.formatRoute(route);
                }
            }
            else {
                throw Error('router.addRoutes: the parameter must be an array');
            }
        }
    }
}
Injectable("Router")(["InternalRouter", Router]);
