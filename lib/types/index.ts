import { ReactiveStorageInstance } from './mainClass';

export interface ReactiveStorageOptions {
    type: 'local' | 'session',
    name: string,
    ttl?: number,
}

export type ReactiveStorageHandler<S> = (storage: ReactiveStorageInstance<S>) => void;