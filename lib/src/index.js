import ReactiveStorage from './mainClass';
import Plugin from './plugin';
import ReactiveStorageVuexModule from './vuexModule';
export { injectStorage, makeReactiveProp, injectProp, injectVuex } from './tools';
export { StorageError } from './mainClass';
const version = '1.0.14';
Plugin.version = version;
window.vueReactiveStoragesPlugin = Plugin;
export { ReactiveStorage, version, ReactiveStorageVuexModule };
export default Plugin;
//# sourceMappingURL=index.js.map