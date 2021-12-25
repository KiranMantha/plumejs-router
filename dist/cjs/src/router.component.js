"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const rxjs_1 = require("rxjs");
const internalRouter_service_1 = require("./internalRouter.service");
let RouterOutlet = class RouterOutlet {
    constructor(internalRouterSrvc, renderer) {
        this.internalRouterSrvc = internalRouterSrvc;
        this.renderer = renderer;
        this._template = '';
        this._subscriptions = new rxjs_1.Subscription();
    }
    beforeMount() {
        this._subscriptions.add(this.internalRouterSrvc.getTemplate().subscribe((tmpl) => {
            this._template = tmpl;
            this.renderer.update();
        }));
        this.internalRouterSrvc.startHashChange();
    }
    mount() {
        const path = window.location.hash.replace(/^#/, '');
        this.internalRouterSrvc.navigateTo(path, null);
    }
    unmount() {
        this._subscriptions.unsubscribe();
        this.internalRouterSrvc.stopHashChange();
    }
    render() {
        if (this._template) {
            const stringArray = [`${this._template}`];
            stringArray.raw = [`${this._template}`];
            return (0, core_1.html)(stringArray);
        }
        else {
            return (0, core_1.html) ``;
        }
    }
};
RouterOutlet = (0, tslib_1.__decorate)([
    (0, core_1.Component)({
        selector: 'router-outlet'
    }),
    (0, tslib_1.__metadata)("design:paramtypes", [internalRouter_service_1.InternalRouter, core_1.Renderer])
], RouterOutlet);
