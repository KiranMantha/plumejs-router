import { __decorate, __metadata } from "tslib";
import { Component, html } from "@plumejs/core";
import { InternalRouter } from "./internalRouter.service";
const registerRouterComponent = () => {
    let RouterOutlet = class RouterOutlet {
        constructor(router) {
            this.router = router;
            this.template = "";
            this.isRoutesAdded = false;
        }
        beforeMount() {
            this.router.$templateSubscriber.subscribe((tmpl) => {
                this.template = tmpl;
                this.update();
            });
        }
        mount() {
            let path = window.location.hash.replace(/^#/, '');
            this.router.navigateTo(path);
        }
        unmount() {
            this.router.$templateSubscriber.unsubscribe();
        }
        render() {
            if (!this.template) {
                return html `
					<div></div>
				`;
            }
            else {
                const stringArray = [`${this.template}`];
                stringArray.raw = [`${this.template}`];
                return html(stringArray);
            }
        }
    };
    RouterOutlet = __decorate([
        Component({
            selector: "router-outlet",
            useShadow: false
        }),
        __metadata("design:paramtypes", [InternalRouter])
    ], RouterOutlet);
};
export { registerRouterComponent };
