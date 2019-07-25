import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import ReactiveStorageVuexModule from './vuexModule';
export { injectStorage, makeReactiveProp, injectProp, injectVuex } from './tools';
export { StorageError } from './mainClass';
const version = '1.0.10';
Plugin.version = version;
window.vueReactiveStoragesPlugin = Plugin;
export { ReactiveStorage, version, ReactiveStorageVuexModule };
export default Plugin;
//# sourceMappingURL=main.js.map