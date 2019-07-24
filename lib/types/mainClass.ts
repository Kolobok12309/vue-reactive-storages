import { ReactiveStorageOptions, ReactiveStorageHandler } from './index';

declare global {
    interface Storage {
        setEItem(key: string, value: any): void;
        getJSONItem(key: string): any;
    }
    // Fix my TS Version
    interface StorageEvent extends Event {
        initStorageEvent(typeArg: string, canBubbleArg: boolean, cancelableArg: boolean, keyArg: string, oldValueArg: any, newValueArg: any, urlArg: string, storageAreaArg: Storage): void;
    }
}

// Класс своих ошибок
export class StorageError extends Error {
    message: string;
    name: string;
    stack!: string;

    constructor(message: string) {
        message = `[ReactiveStorage] ${message}`;
        super(message);
        this.message = message;
        this.name = (<any> this.constructor).name;
    }
}

export interface getStoreByType {
    (type: 'local' | 'session'): Storage;
}

interface ReactiveStorageDefault<S> {
    _$config: ReactiveStorageOptions;
    _$preset: S;
    _$store: Storage;
    _$blacklist: string[];
    _$listeners: ReactiveStorageHandler<S>[];

    _initConfig(): void;
    _hideProps(): void;
    _fixTemplate(): void;
    saveStorage(noNeedEvent: boolean): void;
    addChangeHandler(callback: ReactiveStorageHandler<S>): void;
    removeChangeHandler(callback: ReactiveStorageHandler<S>): void;
    _doChangeHandlers(): void;
}

export type ReactiveStorageInstance<S> = ReactiveStorageDefault<S> & S;

export default interface ReactiveStorageInterface {
    create<S>(
        preset: S,
        config?: ReactiveStorageOptions,
        listeners?: ReactiveStorageHandler<S>[],
        onload?: ReactiveStorageHandler<S>,
    ): ReactiveStorageInstance<S>
}