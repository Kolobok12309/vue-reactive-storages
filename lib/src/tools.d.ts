import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { Store } from 'vuex';
import { ReactiveStorageInstance } from './mainClass';
import Plugin from './plugin';
declare global {
    interface Window {
        Vue?: VueConstructor;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: Store<any>;
        [key: string]: any;
    }
}
export declare function hasOwnProperty(obj: object, key: string): boolean;
export declare function autoVueInject<S>(vuePlugin: Plugin<S>, ...args: any[]): void;
export declare function fixKey(key: string): string;
export declare function injectVuex<S>(app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
export declare function injectProp<S>(Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
export declare function makeReactiveProp<S>(app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
export declare function injectStorage<S>(Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string | undefined, storage: ReactiveStorageInstance<S>): void;
