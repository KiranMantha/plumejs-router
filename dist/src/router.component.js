"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRouterComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@plumejs/core");
const internalRouter_service_1 = require("./internalRouter.service");
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
                return core_1.html `
					<div></div>
				`;
            }
            else {
                const stringArray = [`${this.template}`];
                stringArray.raw = [`${this.template}`];
                return core_1.html(stringArray);
            }
        }
    };
    RouterOutlet = tslib_1.__decorate([
        core_1.Component({
            selector: "router-outlet",
            useShadow: false
        }),
        tslib_1.__metadata("design:paramtypes", [internalRouter_service_1.InternalRouter])
    ], RouterOutlet);
};
exports.registerRouterComponent = registerRouterComponent;
