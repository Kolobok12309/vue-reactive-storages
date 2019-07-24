import { ReactiveStorageInstance } from './mainClass';
import { StoreOptions } from 'vuex';

export default interface vuexModule<S> {
    (reactiveStorage: ReactiveStorageInstance<S>): StoreOptions<ReactiveStorageInstance<S>>;
}