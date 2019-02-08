import vuexModule from './vuexModule';

export function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

// eslint-disable-next-line
export function autoVueInject(vuePlugin, ...args) {
    let globalVue = null;
    if (window !== undefined) {
        globalVue = window.Vue;
    } else if (global !== undefined) {
        globalVue = global.Vue;
    }

    if (globalVue) {
        globalVue.use(vuePlugin, ...args);
    }
}

function fixKey(key) {
    if (key[0] === '$') return key;
    return `$${key}`;
}

function injectVuex(app, propName, storage) {
    const key = fixKey(propName);
    const { store } = app;
    if (store) {
        store.registerModule(key, vuexModule(storage));
    } else if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line
        console.log('[ReactiveStorage] Cannot find vuex store');
    }
}

function injectProp(Vue, app, propName, storage) {
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

function makeReactiveProp(app, propName, storage) {
    const key = fixKey(propName);
    if (!hasOwnProperty(app, 'watch')) app.watch = {};
    if (hasOwnProperty(app.watch, key)) throw new Error('[ReactiveStorage] propName is already used in watchers');

    app.watch[key] = {
        handler() {
            storage.saveStorage();
        },
        deep: true,
    };
}

export function injectStorage(Vue, app, propName = '$RStore', storage) {
    const key = fixKey(propName);
    injectVuex(app, key, storage);
    injectProp(Vue, app, key, storage);
    makeReactiveProp(app, key, storage);
}
