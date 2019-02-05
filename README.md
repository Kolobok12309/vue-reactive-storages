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

`listeners` - Array with listeners, once argument is storage Default []
