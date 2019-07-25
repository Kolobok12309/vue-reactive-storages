import { ReactiveStorageOptions, ReactiveStorageHandler } from './types';
declare global {
    interface Storage {
        setEItem(key: string, value: any): void;
        getJSONItem(key: string): any;
    }
    interface StorageEvent extends Event {
        initStorageEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, keyArg: string, oldValueArg: any, newValueArg: any, urlArg: string, storageAreaArg: Storage): void;
    }
}
export declare class StorageError extends Error {
    message: string;
    name: string;
    stack: string;
    constructor(message: string);
}
export interface ReactiveStorageDefault<S> {
    _$config: ReactiveStorageOptions;
    _$preset: S;
    _$store: Storage;
    _$blacklist: string[];
    _$listeners: ReactiveStorageHandler<S>[];
    [key: string]: any;
    _initConfig(): void;
    _hideProps(): void;
    _fixTemplate(): void;
    saveStorage(noNeedEvent?: boolean): void;
    addChangeHandler(callback: ReactiveStorageHandler<S>): void;
    removeChangeHandler(callback: ReactiveStorageHandler<S>): void;
    _doChangeHandlers(): void;
}
export declare class _ReactiveStorage<S> implements ReactiveStorageDefault<S> {
    _$config: ReactiveStorageOptions;
    _$preset: S;
    _$store: Storage;
    _$blacklist: string[];
    _$listeners: ReactiveStorageHandler<S>[];
    [key: string]: any;
    constructor(preset: S, config?: ReactiveStorageOptions, listeners?: ReactiveStorageHandler<S>[]);
    _initConfig(): void;
    _hideProps(): void;
    _fixTemplate(): void;
    saveStorage(noNeedEvent?: boolean): void;
    addChangeHandler(callback: ReactiveStorageHandler<S>): void;
    removeChangeHandler(callback: ReactiveStorageHandler<S>): void;
    _doChangeHandlers(): void;
}
export declare type ReactiveStorageInstance<S> = ReactiveStorageDefault<S> & S;
export interface ReactiveStorageInterface {
    create<S>(preset: S, config?: ReactiveStorageOptions, listeners?: ReactiveStorageHandler<S>[], onload?: ReactiveStorageHandler<S>): ReactiveStorageInstance<S>;
}
declare const ReactiveStorage: ReactiveStorageInterface;
export default ReactiveStorage;
