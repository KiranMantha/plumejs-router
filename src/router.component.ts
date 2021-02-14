import { Component, html } from "@plumejs/core";
import { InternalRouter } from "./internalRouter.service";

const registerRouterComponent = () => {
	@Component({
		selector: "router-outlet",
		useShadow: false
	})
	class RouterOutlet {
		template = "";
		update: Function;

		isRoutesAdded = false;

		constructor(private router: InternalRouter) { }

		beforeMount() {
			this.router.$templateSubscriber.subscribe((tmpl: string) => {
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
				return html`
					<div></div>
				`;
			} else {
				const stringArray = [`${this.template}`] as any;
				stringArray.raw = [`${this.template}`];
				return html(stringArray);
			}
		}
	}
};

export { registerRouterComponent };

