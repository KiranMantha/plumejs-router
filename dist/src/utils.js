const isObservable = (obj) => !!obj && typeof obj.subscribe === 'function';
const isPromise = (obj) => !!obj && typeof obj.then === 'function';
const ofObs = (input) => {
    return {
        subscribe: (fn) => {
            fn(input);
        }
    };
};
const fromPromiseObs = (input) => {
    return {
        subscribe: (callback) => {
            Promise.resolve(input).then((value) => {
                callback(value);
            });
        }
    };
};
class SubjectObs {
    _internalFn;
    asObservable() {
        return {
            subscribe: (callback) => {
                return this.subscribe(callback);
            }
        };
    }
    subscribe(callback) {
        this._internalFn = callback;
        return this.unsubscribe;
    }
    unsubscribe() {
        this._internalFn = null;
    }
    next(value) {
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
const fromVanillaEvent = (target, eventName, onNext, options = false) => {
    target.addEventListener(eventName, onNext, options);
    const unsubscribe = () => {
        target.removeEventListener(eventName, onNext, options);
    };
    return unsubscribe;
};
export { wrapIntoObservable, SubjectObs, fromVanillaEvent };
