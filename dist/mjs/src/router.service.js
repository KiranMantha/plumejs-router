import { __decorate, __metadata } from "tslib";
import { Injectable } from '@plumejs/core';
import { isNode } from 'browser-or-node';
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';
let Router = class Router {
    internalRouter;
    constructor(internalRouter) {
        this.internalRouter = internalRouter;
    }
    getCurrentRoute() {
        return this.internalRouter.getCurrentRoute();
    }
    navigateTo(path, state) {
        this.internalRouter.navigateTo(path, state);
    }
    static registerRoutes(routes, preloadAllRoutes = false) {
        if (!isNode) {
            if (Array.isArray(routes)) {
                for (const route of routes) {
                    StaticRouter.formatRoute(route);
                }
                preloadAllRoutes && StaticRouter.preloadRoutes();
            }
            else {
                throw Error('router.addRoutes: the parameter must be an array');
            }
        }
    }
};
Router = __decorate([
    Injectable({ deps: [InternalRouter] }),
    __metadata("design:paramtypes", [InternalRouter])
], Router);
export { Router };
