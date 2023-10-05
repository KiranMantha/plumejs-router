declare class SubjectObs<T> {
    _internalFn: (value?: T) => void;
    asObservable(): {
        subscribe: (callback: (value?: T) => void) => () => void;
    };
    subscribe(callback: (value?: T) => void): () => void;
    unsubscribe(): void;
    next(value: T): void;
}
declare const wrapIntoObservable: (value: any) => any;
declare const matchPath: (route: string, path: string) => boolean;
export { wrapIntoObservable, SubjectObs, matchPath };
