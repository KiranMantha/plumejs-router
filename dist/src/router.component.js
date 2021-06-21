import { Component, html, Renderer } from '@plumejs/core';
import { Subscription } from 'rxjs';
import { InternalRouter } from './internalRouter.service';
class RouterOutlet {
    router;
    renderer;
    _template = '';
    _subscriptions = new Subscription();
    constructor(router, renderer) {
        this.router = router;
        this.renderer = renderer;
    }
    beforeMount() {
        this._subscriptions.add(this.router.getTemplate().subscribe((tmpl) => {
            this._template = tmpl;
            this.renderer.update();
        }));
    }
    mount() {
        const path = window.location.hash.replace(/^#/, '');
        this.router.navigateTo(path);
    }
    unmount() {
        this._subscriptions.unsubscribe();
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
}
Component({
  selector: 'router-outlet',
  useShadow: false
})(["InternalRouter", "Renderer", RouterOutlet]);
