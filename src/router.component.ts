import { Component, IHooks, Subscriptions, signal } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';

class RouterOutlet implements IHooks {
  private _template = signal('');
  private _subscriptions = new Subscriptions();

  constructor(private internalRouterSrvc: InternalRouter) {}

  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((tmpl: string) => {
        if (this._template() !== tmpl) {
          this._template.set(tmpl);
        }
      })
    );
    this._subscriptions.add(this.internalRouterSrvc.listenRouteChanges());
  }

  mount() {
    const path = window.location.pathname;
    this.internalRouterSrvc.navigateTo(path || '/', null);
  }

  unmount() {
    this._subscriptions.unsubscribe();
  }

  render() {
    return this._template();
  }
}

const registerRouterOutlet = () => {
  Component({
    selector: 'router-outlet',
    deps: [InternalRouter]
  })(RouterOutlet);
};

export { registerRouterOutlet };
