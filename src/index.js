import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import { injectStorage } from './tools';

const plugin = new Plugin();
const version = '1.0.8';

plugin.version = version;
plugin.ReactiveStorage = ReactiveStorage;
plugin.injectStorage = injectStorage;

window.vueReactiveStoragesPlugin = plugin;

export { ReactiveStorage, injectStorage, version };

export default plugin;
