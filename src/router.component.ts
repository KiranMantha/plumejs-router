import { Component, html, IHooks } from '@plumejs/core';
import { InternalRouter } from './internalRouter.service';

@Component({
  selector: 'router-outlet',
  deps: [InternalRouter]
})
class RouterOutlet implements IHooks {
  private _template = '';
  private _templateSubscription: () => void;

  constructor(private internalRouterSrvc: InternalRouter) {}

  beforeMount() {
    this._templateSubscription = this.internalRouterSrvc.getTemplate().subscribe((tmpl: string) => {
      this._template = tmpl;
    });

    this.internalRouterSrvc.startHashChange();
  }

  mount() {
    const path = window.location.hash.replace(/^#/, '');
    this.internalRouterSrvc.navigateTo(path, null);
  }

  unmount() {
    this._templateSubscription();
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
