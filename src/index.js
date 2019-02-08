import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import { injectStorage } from './tools';

const plugin = new Plugin();

window.vueReactiveStoragesPlugin = plugin;

export const version = '1.0.6';

export { ReactiveStorage, injectStorage };

export default plugin;
