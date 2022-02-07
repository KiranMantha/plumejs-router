"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromVanillaEvent = exports.SubjectObs = exports.wrapIntoObservable = void 0;
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
        subscribe: (fn) => {
            Promise.resolve(input).then((value) => {
                fn(value);
            });
        }
    };
};
class SubjectObs {
    asObservable() {
        return {
            subscribe: (fn) => {
                return this.subscribe(fn);
            }
        };
    }
    subscribe(fn) {
        this._internalFn = fn;
        return this.unsubscribe;
    }
    unsubscribe() {
        this._internalFn = null;
    }
    next(value) {
        this._internalFn(value);
    }
}
exports.SubjectObs = SubjectObs;
const wrapIntoObservable = (value) => {
    if (isObservable(value)) {
        return value;
    }
    if (isPromise(value)) {
        return fromPromiseObs(Promise.resolve(value));
    }
    return ofObs(value);
};
exports.wrapIntoObservable = wrapIntoObservable;
const fromVanillaEvent = (target, eventName, onNext, options = false) => {
    target.addEventListener(eventName, onNext, options);
    const unsubscribe = () => {
        target.removeEventListener(eventName, onNext, options);
    };
    return unsubscribe;
};
exports.fromVanillaEvent = fromVanillaEvent;
