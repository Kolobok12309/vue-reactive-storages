import { ReactiveStorageHandler, ReactiveStorageOptions } from './types/index';
import ReactiveStorage, { ReactiveStorageMixin, ReactiveStorageType } from './mainClass';
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { injectStorage } from './tools';


export default class Plugin<S> {
    storage: ReactiveStorageMixin<S> | null;

    version: string;
    ReactiveStorage: ReactiveStorageType;
    injectStorage: (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageMixin<S>) => void;

    constructor(version: string) {
        this.storage = null;
        this.version = version;
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
    }: {
        app: ComponentOptions<Vue>,
        type: 'local' | 'session',
        storageName: string,
        propName: string,
        ttl: number,
        preset: S,
        listeners: ReactiveStorageHandler<S>[],
    }) {
        if (app === undefined) throw new Error('[ReactiveStorage] undefined app');
        if (preset === undefined) throw new Error('[ReactiveStorage] undefined preset');

        const config: ReactiveStorageOptions = {
            type,
            name: storageName,
            ttl,
        };

        this.storage = new ReactiveStorage<S>(preset, config, listeners);

        injectStorage(Vue, app, propName, this.storage);
    }
}
