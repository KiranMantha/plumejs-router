import { __decorate, __metadata } from "tslib";
import { Component, html, Renderer } from '@plumejs/core';
import { Subscription } from 'rxjs';
import { InternalRouter } from './internalRouter.service';
let RouterOutlet = class RouterOutlet {
    internalRouterSrvc;
    renderer;
    _template = '';
    _subscriptions = new Subscription();
    constructor(internalRouterSrvc, renderer) {
        this.internalRouterSrvc = internalRouterSrvc;
        this.renderer = renderer;
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
            return html(stringArray);
        }
        else {
            return html ``;
        }
    }
};
RouterOutlet = __decorate([
    Component({
        selector: 'router-outlet'
    }),
    __metadata("design:paramtypes", [InternalRouter, Renderer])
], RouterOutlet);
