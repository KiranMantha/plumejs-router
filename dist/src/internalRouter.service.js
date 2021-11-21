"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalRouter = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const rxjs_1 = require("rxjs");
const staticRouter_1 = require("./staticRouter");
let InternalRouter = class InternalRouter {
    _currentRoute = {
        params: {}
    };
    _template = new rxjs_1.Subject();
    constructor() {
        (0, rxjs_1.fromEvent)(window, 'hashchange').subscribe(() => {
            this._registerOnHashChange();
        });
    }
    getTemplate() {
        return this._template.asObservable();
    }
    getCurrentRoute() {
        return this._currentRoute;
    }
    navigateTo(path = '') {
        if (path) {
            const windowHash = window.location.hash.replace(/^#/, '');
            if (windowHash === path) {
                this._navigateTo(path);
            }
            window.location.hash = '#' + path;
        }
        else {
            this._navigateTo(path);
        }
    }
    _registerOnHashChange() {
        const path = window.location.hash.replace(/^#/, '');
        this._navigateTo(path);
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
    _navigateTo(path) {
        const uParams = path.split('/').filter((h) => {
            return h.length > 0;
        });
        const routeArr = staticRouter_1.StaticRouter.routList.filter((route) => {
            if (route.Params.length === uParams.length && this._routeMatcher(route.Url, path)) {
                return route;
            }
            else if (route.Url === path) {
                return route;
            }
        });
        const routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
            (0, core_1.wrapIntoObservable)(routeItem.canActivate()).subscribe((val) => {
                if (!val)
                    return;
                const _params = staticRouter_1.StaticRouter.checkParams(uParams, routeItem);
                if (Object.keys(_params).length > 0 || path) {
                    this._currentRoute.params = _params;
                    if (!routeItem.IsRegistered) {
                        if (routeItem.TemplatePath) {
                            (0, core_1.wrapIntoObservable)(routeItem.TemplatePath()).subscribe(() => {
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
                    this.navigateTo(routeItem.redirectTo);
                }
            });
        }
    }
};
InternalRouter = (0, tslib_1.__decorate)([
    (0, core_1.Injectable)(),
    (0, tslib_1.__metadata)("design:paramtypes", [])
], InternalRouter);
exports.InternalRouter = InternalRouter;
