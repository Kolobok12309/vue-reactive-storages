import ReactiveStorage from '@/mainClass';
import Plugin from './plugin';
import { injectStorage } from './tools';

declare global {
    interface Window {
        vueReactiveStoragesPlugin: Plugin<any>;
    }
}

const version = '1.0.9';
const plugin = new Plugin(version);

window.vueReactiveStoragesPlugin = plugin;

export { ReactiveStorage, injectStorage, version };

export default plugin;
