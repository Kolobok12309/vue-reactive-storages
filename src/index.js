import ReactiveStorage from './mainClass';
import vuexModule from './vuexModule';

function hasOwnProperty(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

// eslint-disable-next-line
function autoVueInject(vuePlugin, ...args) {
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

class Plugin {
    constructor() {
        this.Vue = null;
        this.app = null;
        this.storage = null;
    }

    install(Vue, {
        app, type = 'local', storageName = '$RStore', propName = '$RStore', ttl = 60 * 60 * 24 * 1000 * 7, preset, listeners = [],
    }) {
        if (app === undefined) throw new Error('[ReactiveStorage] undefined app');
        if (preset === undefined) throw new Error('[ReactiveStorage] undefined preset');

        this.Vue = Vue;
        this.app = app;

        const config = {
            type,
            name: storageName,
            ttl,
        };

        this.storage = new ReactiveStorage(preset, config, listeners);

        this.injectVuex(propName);
        this.injectProp(propName);
        this.makeReactiveProp(propName);
    }

    injectVuex(propName) {
        const { store } = this.app;
        if (store) {
            store.registerModule(propName, vuexModule(this.storage));
        } else if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line
            console.log('[ReactiveStorage] Cannot find vuex store');
        }
    }

    injectProp(propName) {
        const { Vue, app, storage } = this;
        if (hasOwnProperty(app, propName) || hasOwnProperty(Vue.prototype, propName)) {
            throw new Error('[ReactiveStorage] propName is already used');
        }
        app[propName] = storage;

        Vue.use(() => {
            Vue.mixin({
                data() {
                    return {
                        [propName]: storage,
                    };
                },
            });

            Object.defineProperty(Vue.prototype, propName, {
                get() {
                    return storage;
                },
            });
        });
    }

    makeReactiveProp(propName) {
        const { app, storage } = this;
        if (!hasOwnProperty(app, 'watch')) app.watch = {};
        if (hasOwnProperty(app.watch, propName)) throw new Error('[ReactiveStorage] propName is already in users in watchers');

        app.watch[propName] = {
            handler() {
                storage.saveStorage(true);
            },
            deep: true,
        };
    }
}

const plugin = new Plugin();

window.vueReactiveStoragesPlugin = plugin;

export default plugin;
