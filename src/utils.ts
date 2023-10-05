const isObservable = (obj) => !!obj && typeof obj.subscribe === 'function';
const isPromise = (obj) => !!obj && typeof obj.then === 'function';

const ofObs = (input: any) => {
  return {
    subscribe: (fn: (value: any) => void) => {
      fn(input);
    }
  };
};

const fromPromiseObs = (input: Promise<any>) => {
  return {
    subscribe: (callback: (value: any) => void) => {
      Promise.resolve(input).then((value) => {
        callback(value);
      });
    }
  };
};

class SubjectObs<T> {
  _internalFn: (value?: T) => void;

  asObservable(): { subscribe: (callback: (value?: T) => void) => () => void } {
    return {
      subscribe: (callback: (value?: T) => void): (() => void) => {
        return this.subscribe(callback);
      }
    };
  }

  subscribe(callback: (value?: T) => void): () => void {
    this._internalFn = callback;
    return this.unsubscribe;
  }

  unsubscribe() {
    this._internalFn = null;
  }

  next(value: T) {
    this._internalFn(value);
  }
}

const wrapIntoObservable = (value) => {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    return fromPromiseObs(Promise.resolve(value));
  }

  return ofObs(value);
};

const matchPath = (route: string, path: string): boolean => {
  if (route && path) {
    const pattern = new RegExp(route.replace(/:[^\s/]+/g, '([\\w-]+)'));
    return pattern.test(path);
  }
  return false;
};

export { wrapIntoObservable, SubjectObs, matchPath };
