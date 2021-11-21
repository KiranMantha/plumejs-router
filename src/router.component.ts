import { Component, html, IHooks, Renderer } from '@plumejs/core';
import { Subscription } from 'rxjs';
import { InternalRouter } from './internalRouter.service';

@Component({
  selector: 'router-outlet'
})
class RouterOutlet implements IHooks {
  private _template = '';
  private _subscriptions = new Subscription();

  constructor(private router: InternalRouter, private renderer: Renderer) {}

  beforeMount() {
    this._subscriptions.add(
      this.router.getTemplate().subscribe((tmpl: string) => {
        this._template = tmpl;
        this.renderer.update();
      })
    );
  }

  mount() {
    const path = window.location.hash.replace(/^#/, '');
    this.router.navigateTo(path);
  }

  unmount() {
    this._subscriptions.unsubscribe();
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
