import { Component, html, IHooks, Renderer } from '@plumejs/core';
import { Subscription } from 'rxjs';
import { InternalRouter } from './internalRouter.service';

@Component({
  selector: 'router-outlet'
})
class RouterOutlet implements IHooks {
  private _template = '';
  private _subscriptions = new Subscription();

  constructor(private internalRouterSrvc: InternalRouter, private renderer: Renderer) {}

  beforeMount() {
    this._subscriptions.add(
      this.internalRouterSrvc.getTemplate().subscribe((tmpl: string) => {
        this._template = tmpl;
        this.renderer.update();
      })
    );
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
      const stringArray = [`${this._template}`] as any;
      stringArray.raw = [`${this._template}`];
      return html(stringArray);
    } else {
      return html``;
    }
  }
}
