declare class SubjectObs<T> {
    _internalFn: (value?: T) => void;
    asObservable(): {
        subscribe: (fn: (value?: T) => void) => () => void;
    };
    subscribe(fn: (value?: T) => void): () => void;
    unsubscribe(): void;
    next(value: T): void;
}
declare const wrapIntoObservable: (value: any) => any;
declare const fromVanillaEvent: (target: EventTarget, eventName: string, onNext: EventListenerOrEventListenerObject, options?: boolean) => (() => void);
export { wrapIntoObservable, SubjectObs, fromVanillaEvent };
