import { ReactiveStorageInstance } from './mainClass';
import { StoreOptions } from 'vuex';

export default <S>(reactiveStorage: ReactiveStorageInstance<S>): StoreOptions<ReactiveStorageInstance<S>> => ({
    state: reactiveStorage,
    mutations: {
        saveReactiveStorage() {
            reactiveStorage.saveStorage(true);
        },
    },
    getters: {
        getReactiveStorage() {
            return reactiveStorage;
        },
    },
});
