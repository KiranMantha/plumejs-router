# PlumeJs Router

[PlumeJs](https://github.com/kiranmantha/plumejs) uses hash-based Routing. It uses dynamic imports to chunk out route specific logic which reduces main bundle size significantly. Routing can be implemented as follows:

1. Run `npm i -S @plumejs/router`

2. Declare routes array and register router component as below

```typescript
  import { Component, html } from '@plumejs/core';
  import { Router, Route } from '@plumejs/router';

  @Component({
    selector: 'app-comp',
    root: true
  })
  class AppComponent {
    constructor() {
      Router.registerRoutes(this.routes);
    }

    routes: Array<Route> = [{
      path: '',
      redirectto: '/home',
    }, {
      path: '/home',
      template: '<app-home></app-home>',
      templatePath: () => import('<path-to-ts-file-of-home-component>')
    }, {
      path: '/contactus',
      template: '<app-contactus></app-contactus>',
      templatePath: () => import('<path-to-ts-file-of-contactus-component>')
    }, {
      path: '/details/:id',
      template: '<app-details></app-details>',
      templatePath: () => import('<path-to-ts-file-of-details-component>'),
      // canActivate route gaurd helps to check wheter the route is accesseble or not.
      // canActivate function should return Promise<boolean> or Observable<boolean> or boolean.
      canActivate: () => {
        let key = localStorage.getItem('key');
        if(!key) {
          this.router.navigateTo('/home');
          return false;
        }
        return true;
      }
    }],

    render() {
        return html`
            <router-outlet></router-outlet>
        `;
    }
  }
```

That's it. Now we have the routing in our application.

# Navigation via service

To navigate from one route to other from a component:

```typescript
import { Component } from '@plumejs/core';
import { Router } from '@plumejs/router';

@Component({
  selector: 'your-selector'
})
class YourClass {
  constructor(private router: Router) {}

  onclick() {
    this.router.navigateTo('/your-route');
  }
}
```

# Accessing Route Params

To Access current route parameters

```typescript
  route = [{
    path: '/details/:id'
    ....
  }]
  ...

  If url is /details/123 then:

  const currentRoute = this.router.getCurrentRoute();
  const path = currentRoute.path; // returns '/details'
  const id = currentRoute.params.id; /// returns 123
```

# Pass state in route

There may be usecases where devs need to pass complex objects without using route params. This provision is added in new router package. to pass and read state:

```typescript
import { Component } from '@plumejs/core';
import { Router } from '@plumejs/router';

@Component({
  selector: 'your-selector'
})
class YourClass {
  constructor(private router: Router) {}

  onclick() {
    this.router.navigateTo('/your-route', { <some-complex-object> });
  }
}

//in other route component
@Component({
  selector: 'other-comp'
})
class OtherComponent{
  constructor(private router: Router) {}

  mount() {
    const state = currentRoute.state; // returns empty obj by default.
  }
}
```
