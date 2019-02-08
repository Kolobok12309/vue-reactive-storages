# vue-reactive-storages

## Installation

Using npm:
```
npm install --save vue-reactive-storages
```
Using cdn:
```html
<script src="https://unpkg.com/vue-reactive-storages"></script>
<script>console.log(vueReactiveStoragesPlugin);</script>
```

## Example

```js
const reactivePlugin = require('vue-reactive-storages');
const Vue = require('vue');

const app = {
    router,
    store,
    render: h => h(App),
}

function listener(storage) {
    console.log(storage);
}

Vue.use(reactivePlugin, {
    app,
    preset: {
        test: '',
    },
    type: 'local',
    propName: '$RStore',
    listeners: [listener],
});

new Vue(app).$mount('#app');
```

## Options

`app` - Required prop to create reactive storage and inject vuex

`preset` - Required prop to set scheme

`type` - Type of storage 'local' | 'session' Default `local`

`storageName` - Name of prop in local/sessionStorage Default `$RStore`

`propName` - Name of prop in Vue components and name of Vuex module (if exist) Default `$RStore`

`listeners` - Array with listeners on change data, once argument is storage Default []

## Api

### saveStorage

#### Arguments

`noNeedEvent` - Boolean true/false
If true, events started in other tabs and run handlers
Else if false, events started in all tabs(and in the same), and run handlers
Default true

In most situations you don't need this function, but if you lose reactivity from Vue in this object, you can use it

#### Example

```js
Vue.use(reactivePlugin, {
    app,
    preset: {
        test: '',
    },
    type: 'local',
    propName: '$RStore',
    listeners: [listener],
});
const store = app.$RStore;
store.saveStorage();
```

### addChangeHandler

Function to add change-handler

#### Arguments

function with one arguments:
`reactiveStore` - It's reactive store

#### Example
```js
...
store.addChangeHandler((reactiveStore) => console.log(reactiveStore));
store.test = '1';
...
```

### removeChangeHandler

Function ro remova change-handler, need the same function as in `addChangeHandler`

### Arguments

function

#### Example

```js
function log(reactiveStore) {
    console.log(reactiveStore)
}
store.addChangeHandler(log);
store.test = '1';
store.removeChangeHandler(log);
store.test = '2';
```

# Separate api

## reactiveStorage

Class for creating reactive storages

### Arguments

`preset` - Required arg to set scheme

#### config

`type` - Type of storage 'local' | 'session' Default `local`

`name` - Name of prop in local/sessionStorage Default `$RStore`

`listeners` - Array with listeners on change data, once argument is storage Default []

### Example
```js
import { ReactiveStorage } from 'vue-reactive-storages';

const preset = {
    user: {
        token: '',
        id: '',
        login: '',
        role: '',
    },
};
const config = {
    type: 'local',
    name: '$RStore',
};

export default new ReactiveStorage(preset, config);
```

## injectStorage

function to inject storage in Vue

### Arguments

`Vue` - Vue object

`app` - Required prop to create reactive storage and inject vuex

`propName` - Name of prop in Vue components and name of Vuex module (if exist) Default `$RStore`

`storage` - Object of injectable `ReactiveStorage`

### Example
```js
import Vue from 'vue';
import { injectStorage } from 'vue-reactive-storages';
import reactiveStore from './store';

const app = {
    router,
    store,
    render: h => h(App),
}

injectStorage(Vue, app, '$RStore', reactiveStore);
```

## version

Version of packet

### Example

```js
import { version } from 'vue-reactive-storages';

console.log(version);
```