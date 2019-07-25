import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { ReactiveStorageInstance, ReactiveStorageInterface } from './mainClass';
import { ReactiveStorageHandler } from './types';
export interface PluginOptions<S> {
    app: ComponentOptions<Vue>;
    type?: 'local' | 'session';
    storageName?: string;
    propName?: string;
    ttl?: number;
    preset: S;
    listeners?: ReactiveStorageHandler<S>[];
}
interface PluginI<S> {
    storage: ReactiveStorageInstance<S> | null;
    ReactiveStorage: ReactiveStorageInterface;
    injectStorage: (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>) => void;
    install(Vue: VueConstructor, options: PluginOptions<S>): void;
}
export default class Plugin<S> implements PluginI<S> {
    storage: ReactiveStorageInstance<S> | null;
    static version: string;
    ReactiveStorage: ReactiveStorageInterface;
    injectStorage: (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>) => void;
    constructor();
    install(Vue: VueConstructor, { app, type, storageName, propName, ttl, preset, listeners, }: PluginOptions<S>): void;
}
export {};
