import { Component, html } from "@plumejs/core";
import { Subscription } from 'rxjs';
import { InternalRouter } from "./internalRouter.service";
const registerRouterComponent = () => {
    class RouterOutlet {
        constructor(router) {
            this.router = router;
            this._template = "";
            this._subscriptions = new Subscription();
        }
        beforeMount() {
            this._subscriptions.add(this.router.getTemplate().subscribe((tmpl) => {
                this._template = tmpl;
                this.update();
            }));
        }
        mount() {
            let path = window.location.hash.replace(/^#/, '');
            this.router.navigateTo(path);
        }
        unmount() {
            this._subscriptions.unsubscribe();
        }
        render() {
            if (!this._template) {
                return html `
					<div></div>
				`;
            }
            else {
                const stringArray = [`${this._template}`];
                stringArray.raw = [`${this._template}`];
                return html(stringArray);
            }
        }
    }
    Component({
		selector: "router-outlet",
		useShadow: false
	})(["InternalRouter", RouterOutlet]);
};
export { registerRouterComponent };
