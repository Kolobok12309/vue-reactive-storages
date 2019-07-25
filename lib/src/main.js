import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import { injectStorage } from './tools';
const version = '1.0.10';
Plugin.version = version;
window.vueReactiveStoragesPlugin = Plugin;
export { ReactiveStorage, injectStorage, version };
export default Plugin;
//# sourceMappingURL=main.js.map