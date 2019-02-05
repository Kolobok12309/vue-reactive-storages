export default reactiveStorage => ({
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
