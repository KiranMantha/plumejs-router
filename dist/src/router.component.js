import { __decorate, __metadata } from "tslib";
import { Component, html } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
let RouterOutlet = class RouterOutlet {
    internalRouterSrvc;
    _template = '';
    _templateSubscription;
    constructor(internalRouterSrvc) {
        this.internalRouterSrvc = internalRouterSrvc;
    }
    beforeMount() {
        this._templateSubscription = this.internalRouterSrvc.getTemplate().subscribe((tmpl) => {
            this._template = tmpl;
        });
        this.internalRouterSrvc.startHashChange();
    }
    mount() {
        const path = window.location.hash.replace(/^#/, '');
        this.internalRouterSrvc.navigateTo(path, null);
    }
    unmount() {
        this._templateSubscription();
        this.internalRouterSrvc.stopHashChange();
    }
    render() {
        if (this._template) {
            const stringArray = [`${this._template}`];
            stringArray.raw = [`${this._template}`];
            return html(stringArray);
        }
        else {
            return html ``;
        }
    }
};
RouterOutlet = __decorate([
    Component({
        selector: 'router-outlet',
        deps: [InternalRouter]
    }),
    __metadata("design:paramtypes", [InternalRouter])
], RouterOutlet);
