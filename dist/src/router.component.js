import { __decorate, __metadata } from "tslib";
import { Component, html, Renderer } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
let RouterOutlet = class RouterOutlet {
    internalRouterSrvc;
    renderer;
    _template = '';
    _templateSubscription;
    constructor(internalRouterSrvc, renderer) {
        this.internalRouterSrvc = internalRouterSrvc;
        this.renderer = renderer;
    }
    beforeMount() {
        this._templateSubscription = this.internalRouterSrvc.getTemplate().subscribe((tmpl) => {
            this._template = tmpl;
            this.renderer.update();
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
        deps: [InternalRouter, Renderer]
    }),
    __metadata("design:paramtypes", [InternalRouter, Renderer])
], RouterOutlet);
