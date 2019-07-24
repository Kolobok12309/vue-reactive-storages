import ReactiveStorage, { ReactiveStorageType, ReactiveStorageMixin } from '@/mainClass';
import vuexModule from './vuexModule';
import Plugin from './plugin'
import Vue, { VueConstructor, ComponentOptions } from 'vue';
import { Store } from 'vuex';

export function hasOwnProperty(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

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


// eslint-disable-next-line
export function autoVueInject<S>(vuePlugin: Plugin<S>, ...args: any[]): void {
    let globalVue = null;
    if (window !== undefined) {
        globalVue = window.Vue;
    }

    if (globalVue) {
        globalVue.use(vuePlugin, ...args);
    }
}

function fixKey(key: string): string {
    if (key[0] === '$') return key;
    return `$${key}`;
}

function injectVuex<S>(app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageMixin<S>):void {
    const key = fixKey(propName);
    const { store } = app;
    if (store) {
        store.registerModule(key, vuexModule(storage));
    } else if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log('[ReactiveStorage] Cannot find vuex store');
    }
}

function injectProp<S>(Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageMixin<S>):void {
    const key = fixKey(propName);
    if (hasOwnProperty(app, key) || hasOwnProperty(Vue.prototype, key)) {
        throw new Error('[ReactiveStorage] propName is already used');
    }
    app[key] = storage;

    Vue.use(() => {
        Vue.mixin({
            data() {
                return {
                    [key]: storage,
                };
            },
        });

        Object.defineProperty(Vue.prototype, key, {
            get() {
                return storage;
            },
        });
    });
}

function makeReactiveProp<S>(app: ComponentOptions<Vue>, propName: string, storage: ReactiveStorageMixin<S>):void {
    const key = fixKey(propName);
    if (!app.watch) app.watch = {};
    if (hasOwnProperty(app.watch, key)) throw new Error('[ReactiveStorage] propName is already used in watchers');

    app.watch[key] = {
        handler() {
            storage.saveStorage();
        },
        deep: true,
    };
}

export function injectStorage<S>(Vue: VueConstructor, app: ComponentOptions<Vue>, propName: string = '$RStore', storage: ReactiveStorageMixin<S>): void {
    const key = fixKey(propName);
    injectVuex<S>(app, key, storage);
    injectProp<S>(Vue, app, key, storage);
    makeReactiveProp<S>(app, key, storage);
}
