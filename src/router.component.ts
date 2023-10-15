import { Component, html, IHooks, Renderer, Subscriptions } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';

@Component({
  selector: 'router-outlet',
  deps: [InternalRouter, Renderer]
})
class RouterOutlet implements IHooks {
  private _template = '';
  private _subscriptions = new Subscriptions();

  constructor(private internalRouterSrvc: InternalRouter, private renderer: Renderer) {}

  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((tmpl: string) => {
        if (this._template !== tmpl) {
          this._template = tmpl;
        } else {
          this.refreshRouterOutletComponent();
        }
      })
    );
    this._subscriptions.add(this.internalRouterSrvc.listenRouteChanges());
  }

  mount() {
    const path = StaticRouter.isHistoryBasedRouting ? window.location.pathname : window.location.hash.replace(/^#/, '');
    this.internalRouterSrvc.navigateTo(path || '/', null);
  }

  unmount() {
    this._subscriptions.unsubscribe();
  }

  refreshRouterOutletComponent() {
    if (this.renderer.shadowRoot.children.length) {
      const event = new CustomEvent('refresh_component', {
        detail: {},
        bubbles: false,
        cancelable: false,
        composed: false
      });
      this.renderer.shadowRoot.children[0].dispatchEvent(event);
    }
  }

  render() {
    if (this._template) {
      const stringArray = [`${this._template}`] as any;
      stringArray.raw = [`${this._template}`];
      return html(stringArray);
    } else {
      return html``;
    }
  }
}
