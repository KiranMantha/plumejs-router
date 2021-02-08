"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const browser_or_node_1 = require("browser-or-node");
const staticRouter_1 = require("./staticRouter");
const internalRouter_service_1 = require("./internalRouter.service");
let Router = class Router {
    constructor(internalRouter) {
        this.getCurrentRoute = internalRouter.getCurrentRoute.bind(internalRouter);
        this.navigateTo = internalRouter.navigateTo.bind(internalRouter);
    }
    static registerRoutes(routes) {
        if (!browser_or_node_1.isNode) {
            if (core_1.isArray(routes)) {
                for (let route of routes) {
                    staticRouter_1.StaticRouter.formatRoute(route);
                }
            }
            else {
                throw Error("router.addRoutes: the parameter must be an array");
            }
        }
    }
};
Router = tslib_1.__decorate([
    core_1.Injectable(),
    tslib_1.__metadata("design:paramtypes", [internalRouter_service_1.InternalRouter])
], Router);
exports.Router = Router;
