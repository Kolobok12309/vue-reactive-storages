import ReactiveStorage from './mainClass';
import { injectStorage } from './tools';
export default class Plugin {
    constructor() {
        this.storage = null;
        this.injectStorage = injectStorage;
        this.ReactiveStorage = ReactiveStorage;
    }
    install(Vue, { app, type = 'local', storageName = '$RStore', propName = '$RStore', ttl = 60 * 60 * 24 * 1000 * 7, preset, listeners = [], }) {
        if (app === undefined)
            throw new Error('[ReactiveStorage] undefined app');
        if (preset === undefined)
            throw new Error('[ReactiveStorage] undefined preset');
        const config = {
            type,
            name: storageName,
            ttl,
        };
        this.storage = ReactiveStorage.create(preset, config, listeners);
        injectStorage(Vue, app, propName, this.storage);
    }
}
//# sourceMappingURL=plugin.js.map