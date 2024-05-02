import { Component, IHooks, Renderer, Subscriptions } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';
import { StaticRouter } from './staticRouter';

class RouterOutlet implements IHooks {
  private _template = '';
  private _subscriptions = new Subscriptions();

  constructor(private internalRouterSrvc: InternalRouter, private renderer: Renderer) {}

  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((tmpl: string) => {
        if (this._template !== tmpl) {
          this._template = tmpl;
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

  render() {
    return this._template;
  }
}

const registerRouterOutlet = () => {
  Component({
    selector: 'router-outlet',
    deps: [InternalRouter, Renderer]
  })(RouterOutlet)
}

export { registerRouterOutlet };
