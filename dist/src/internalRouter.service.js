import { __decorate, __metadata } from "tslib";
import { Injectable, wrapIntoObservable } from "@plumejs/core";
import { Subject } from "rxjs";
import { StaticRouter } from "./staticRouter";
let InternalRouter = class InternalRouter {
    constructor() {
        this.currentRoute = {
            params: {},
        };
        this.$templateSubscriber = new Subject();
        window.addEventListener("hashchange", () => {
            this._registerOnHashChange();
        }, false);
    }
    _registerOnHashChange() {
        const path = window.location.hash.replace(/^#/, "");
        this._navigateTo(path);
    }
    _routeMatcher(route, path) {
        if (route) {
            let _matcher = new RegExp(route.replace(/:[^\s/]+/g, "([\\w-]+)"));
            return path.match(_matcher);
        }
        else {
            return route === path;
        }
    }
    _navigateTo(path) {
        let uParams = path.split("/").filter((h) => {
            return h.length > 0;
        });
        let routeArr = StaticRouter.routList.filter((route) => {
            if (route.Params.length === uParams.length &&
                this._routeMatcher(route.Url, path)) {
                return route;
            }
            else if (route.Url === path) {
                return route;
            }
        });
        let routeItem = routeArr.length > 0 ? routeArr[0] : null;
        if (routeItem) {
            wrapIntoObservable(routeItem.canActivate()).subscribe((val) => {
                if (!val)
                    return;
                let _params = StaticRouter.checkParams(uParams, routeItem);
                if (Object.keys(_params).length > 0 || path) {
                    this.currentRoute.params = _params;
                    if (!routeItem.IsRegistered) {
                        if (routeItem.TemplatePath) {
                            wrapIntoObservable(routeItem.TemplatePath()).subscribe((res) => {
                                routeItem.IsRegistered = true;
                                this.$templateSubscriber.next(routeItem.Template);
                            });
                        }
                    }
                    else {
                        this.$templateSubscriber.next(routeItem.Template);
                    }
                }
                else {
                    this.navigateTo(routeItem.redirectTo);
                }
            });
        }
    }
    getCurrentRoute() {
        return this.currentRoute;
    }
    navigateTo(path = "") {
        if (path) {
            let windowHash = window.location.hash.replace(/^#/, "");
            if (windowHash === path) {
                this._navigateTo(path);
            }
            window.location.hash = "#" + path;
        }
        else {
            this._navigateTo(path);
        }
    }
};
InternalRouter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], InternalRouter);
export { InternalRouter };
