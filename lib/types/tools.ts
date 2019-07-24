import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { Store } from 'vuex';
import { ReactiveStorageInstance } from './mainClass.ts';

import Plugin from './plugin';

declare global {
    interface Window {
        Vue?: VueConstructor
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        store?: Store<any>,
        [key: string]: any,
    }
}

export interface hasOwnProperty {
    (obj: object, key: string): boolean;
}

export interface autoVueInject<S> {
    (vuePlugin: Plugin<S>, ...args: any[]): void;
}

export interface fixKey {
    (key: string): string;
}

export interface injectVuex<S> {
    (app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
}

export interface injectProp<S> {
    (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
}

export interface makeReactiveProp<S> {
    (app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
}

export interface injectStorage<S> {
    (Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageInstance<S>): void;
}