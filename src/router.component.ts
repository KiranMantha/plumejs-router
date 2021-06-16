import { Component, html, IHooks, Renderer } from "@plumejs/core";
import { Subscription } from 'rxjs';
import { InternalRouter } from "./internalRouter.service";

const registerRouterComponent = () => {
	@Component({
		selector: "router-outlet",
		useShadow: false
	})
	class RouterOutlet implements IHooks {
		private renderer: Renderer;
		private _template = "";
		private _subscriptions = new Subscription();

		constructor(private router: InternalRouter) { }

		beforeMount() {
			this._subscriptions.add(
				this.router.getTemplate().subscribe((tmpl: string) => {
					this._template = tmpl;
					this.renderer.update();
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
				return html`
					<div></div>
				`;
			} else {
				const stringArray = [`${this._template}`] as any;
				stringArray.raw = [`${this._template}`];
				return html(stringArray);
			}
		}
	}
};

export { registerRouterComponent };

