import Vue, { VueConstructor, ComponentOptions } from 'vue';
import ReactiveStorage, { ReactiveStorageInstance, ReactiveStorageInterface } from './mainClass';
import { ReactiveStorageOptions, ReactiveStorageHandler } from './types';
import { injectStorage } from './tools';

export interface PluginOptions<S> {
    app: ComponentOptions<Vue>,
    type?: 'local' | 'session',
    storageName?: string,
    propName?: string,
    ttl?: number,
    preset: S,
    listeners?: ReactiveStorageHandler<S>[],
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

    constructor() {
        this.storage = null;
        this.injectStorage = injectStorage;
        this.ReactiveStorage = ReactiveStorage;
    }

    install(Vue: VueConstructor, {
        app,
        type = 'local',
        storageName = '$RStore',
        propName = '$RStore',
        ttl = 60 * 60 * 24 * 1000 * 7,
        preset,
        listeners = [],
    }: PluginOptions<S>): void {
        if (app === undefined) throw new Error('[ReactiveStorage] undefined app');
        if (preset === undefined) throw new Error('[ReactiveStorage] undefined preset');

        const config: ReactiveStorageOptions = {
            type,
            name: storageName,
            ttl,
        };

        this.storage = ReactiveStorage.create<S>(preset, config, listeners);

        injectStorage(Vue, app, propName, this.storage);
    }
}