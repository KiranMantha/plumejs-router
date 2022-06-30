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
    subscribe: (fn: (value: any) => void) => {
      Promise.resolve(input).then((value) => {
        fn(value);
      });
    }
  };
};

class SubjectObs<T> {
  _internalFn: (value?: T) => void;

  asObservable(): { subscribe: (fn: (value?: T) => void) => () => void } {
    return {
      subscribe: (fn: (value?: T) => void): (() => void) => {
        return this.subscribe(fn);
      }
    };
  }

  subscribe(fn: (value?: T) => void): () => void {
    this._internalFn = fn;
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

const fromVanillaEvent = (
  target: EventTarget,
  eventName: string,
  onNext: EventListenerOrEventListenerObject,
  options = false
): (() => void) => {
  target.addEventListener(eventName, onNext, options);
  const unsubscribe = () => {
    target.removeEventListener(eventName, onNext, options);
  };
  return unsubscribe;
};

export { wrapIntoObservable, SubjectObs, fromVanillaEvent };