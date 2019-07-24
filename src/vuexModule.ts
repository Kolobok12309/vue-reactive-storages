import { ReactiveStorageMixin } from '@/mainClass';

export default <S>(reactiveStorage: ReactiveStorageMixin<S>) => ({
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
