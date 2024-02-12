import { __decorate, __metadata } from "tslib";
import { Injectable } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';
let Router = class Router {
    internalRouter;
    constructor(internalRouter) {
        this.internalRouter = internalRouter;
    }
    getCurrentRouteInfo() {
        return this.internalRouter.getCurrentRouteInfo();
    }
    navigateTo(path, state) {
        this.internalRouter.navigateTo(path, state);
    }
    onNavigationEnd() {
        return this.internalRouter.onNavigationEnd();
    }
    static registerRoutes({ routes, preloadAllRoutes = false, isHashBasedRouting = false }) {
        if (isHashBasedRouting) {
            StaticRouter.isHistoryBasedRouting = !isHashBasedRouting;
        }
        if (Array.isArray(routes)) {
            for (const route of routes) {
                StaticRouter.formatRoute(route);
            }
            if (preloadAllRoutes) {
                StaticRouter.preloadRoutes();
            }
            else {
                StaticRouter.preloadSelectedRoutes();
            }
        }
        else {
            throw Error('router.addRoutes: the parameter must be an array');
        }
    }
};
Router = __decorate([
    Injectable({ deps: [InternalRouter] }),
    __metadata("design:paramtypes", [InternalRouter])
], Router);
export { Router };
