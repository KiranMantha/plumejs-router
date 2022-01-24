"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const browser_or_node_1 = require("browser-or-node");
const internalRouter_service_1 = require("./internalRouter.service");
const staticRouter_1 = require("./staticRouter");
let Router = class Router {
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
        if (!browser_or_node_1.isNode) {
            if (Array.isArray(routes)) {
                for (const route of routes) {
                    staticRouter_1.StaticRouter.formatRoute(route);
                }
                preloadAllRoutes && staticRouter_1.StaticRouter.preloadRoutes();
            }
            else {
                throw Error('router.addRoutes: the parameter must be an array');
            }
        }
    }
};
Router = (0, tslib_1.__decorate)([
    (0, core_1.Injectable)({ name: 'Router', deps: [internalRouter_service_1.InternalRouter] }),
    (0, tslib_1.__metadata)("design:paramtypes", [internalRouter_service_1.InternalRouter])
], Router);
exports.Router = Router;
