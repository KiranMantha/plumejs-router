"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalRouter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const staticRouter_1 = require("./staticRouter");
const utils_1 = require("./utils");
let InternalRouter = class InternalRouter {
    constructor() {
        this._currentRoute = {
            path: '',
            routeParams: new Map(),
            queryParams: new Map(),
            state: {}
        };
        this._template = new utils_1.SubjectObs();
    }
    startHashChange() {
        this._unSubscribeHashEvent = (0, utils_1.fromVanillaEvent)(window, 'hashchange', () => {
            this._registerOnHashChange();
        });
    }
    stopHashChange() {
        this._unSubscribeHashEvent();
    }
    getTemplate() {
        return this._template.asObservable();
    }
    getCurrentRoute() {
        return this._currentRoute;
    }
    navigateTo(path = '', state) {
        if (path) {
            const windowHash = window.location.hash.replace(/^#/, '');
            if (windowHash === path) {
                this._navigateTo(path, state);
            }
            window.location.hash = '#' + path;
        }
        else {
            this._navigateTo(path, state);
        }
    }
    _registerOnHashChange() {
        const path = window.location.hash.replace(/^#/, '');
        this._navigateTo(path, null);
    }
    _routeMatcher(route, path) {
        if (route) {
            const _matcher = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
            return path.match(_matcher);
        }
        else {
            return route === path;
        }
    }
    _navigateTo(path, state) {
        const uParams = path.split('/').filter((h) => {
            return h.length > 0;
        });
        const routeArr = staticRouter_1.StaticRouter.routeList.filter((route) => {
            if (route.Params.length === uParams.length && this._routeMatcher(route.Url, path)) {
                return route;
            }
            else if (route.Url === path) {
                return route;
            }
        });
        const routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
            this._currentRoute.path = path;
            this._currentRoute.state = Object.assign({}, (state || {}));
            (0, utils_1.wrapIntoObservable)(routeItem.canActivate()).subscribe((val) => {
                if (!val)
                    return;
                const _params = staticRouter_1.StaticRouter.checkParams(uParams, routeItem);
                if (Object.keys(_params).length > 0 || path) {
                    this._currentRoute.routeParams = new Map(Object.entries(_params));
                    const entries = window.location.hash.split('?')[1]
                        ? new URLSearchParams(window.location.hash.split('?')[1]).entries()
                        : [];
                    this._currentRoute.queryParams = new Map(entries);
                    if (!routeItem.IsRegistered) {
                        if (routeItem.TemplatePath) {
                            (0, utils_1.wrapIntoObservable)(routeItem.TemplatePath()).subscribe(() => {
                                routeItem.IsRegistered = true;
                                this._template.next(routeItem.Template);
                            });
                        }
                    }
                    else {
                        this._template.next(routeItem.Template);
                    }
                }
                else {
                    this.navigateTo(routeItem.redirectTo, state);
                }
            });
        }
    }
};
InternalRouter = (0, tslib_1.__decorate)([
    (0, core_1.Injectable)({ name: 'InternalRouter' })
], InternalRouter);
exports.InternalRouter = InternalRouter;
