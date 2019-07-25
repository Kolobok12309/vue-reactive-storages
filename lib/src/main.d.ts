import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import { injectStorage } from './tools';
declare global {
    interface Window {
        vueReactiveStoragesPlugin: typeof Plugin;
    }
}
declare const version = "1.0.10";
export { ReactiveStorage, injectStorage, version };
export default Plugin;
