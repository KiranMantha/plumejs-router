import { __decorate, __metadata } from "tslib";
import { Injectable, isArray } from '@plumejs/core';
import { isNode } from "browser-or-node";
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';
let Router = class Router {
    constructor(internalRouter) {
        this.getCurrentRoute = internalRouter.getCurrentRoute.bind(internalRouter);
        this.navigateTo = internalRouter.navigateTo.bind(internalRouter);
    }
    static registerRoutes(routes) {
        if (!isNode) {
            if (isArray(routes)) {
                for (let route of routes) {
                    StaticRouter.formatRoute(route);
                }
            }
            else {
                throw Error("router.addRoutes: the parameter must be an array");
            }
        }
    }
};
Router = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [InternalRouter])
], Router);
export { Router };
