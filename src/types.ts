import { ReactiveStorageInstance, _ReactiveStorage } from './mainClass';

export interface ReactiveStorageOptions {
    type: 'local' | 'session',
    name: string,
    ttl?: number,
}

export type ReactiveStorageHandler<S> = (storage: ReactiveStorageInstance<S> | _ReactiveStorage<S>) => void;