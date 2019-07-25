import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import ReactiveStorageVuexModule from './vuexModule';
export { injectStorage, makeReactiveProp, injectProp, injectVuex } from './tools';
export { ReactiveStorageOptions, ReactiveStorageHandler } from './types';
export { ReactiveStorageInstance, ReactiveStorageInterface, StorageError } from './mainClass';
export { PluginOptions } from './plugin';
declare global {
    interface Window {
        vueReactiveStoragesPlugin: typeof Plugin;
    }
}
declare const version = "1.0.10";
export { ReactiveStorage, version, ReactiveStorageVuexModule };
export default Plugin;
