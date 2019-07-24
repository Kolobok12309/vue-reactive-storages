import { ReactiveStorageMixin, _ReactiveStorage } from '@/mainClass';

export interface ReactiveStorageOptions {
    type: 'local' | 'session',
    name: string,
    ttl?: number,
}

export type ReactiveStorageHandler<S> = (storage: ReactiveStorageMixin<S> | _ReactiveStorage<S>) => void;