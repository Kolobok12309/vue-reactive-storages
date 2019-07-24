import Vue, { VueConstructor, ComponentOptions } from 'vue';
import ReactiveStorageInterface, { ReactiveStorageInstance } from './mainClass';
import { ReactiveStorageHandler } from './index';

export interface PluginOptions<S> {
    app: ComponentOptions<Vue>,
    type: 'local' | 'session',
    storageName: string,
    propName: string,
    ttl: number,
    preset: S,
    listeners: ReactiveStorageHandler<S>[],
}

export default interface Plugin<S> {
    storage: ReactiveStorageInstance<S> | null;

    version: string;
    ReactiveStorage: ReactiveStorageInterface;
    injectStorage: (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>) => void;

    new(version: string): Plugin<S>;

    install(Vue: VueConstructor, options: PluginOptions<S>): void;
}