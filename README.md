# VuePort!

Library that makes it easy to integrate Vue within Foundry VTT

# Vue version

At this time, only Vue 2 is supported, though support for Vue 3 will be added in the future (patches are welcome!).

# Using VuePort!

To use VuePort!, you need to have a Vue component and to depend on the `vueport` library. You would also need to depend on `dlopen`, as it gets used to dynamically load your components.
In your module.json, add the follow dependencies : 
```json
    "dependencies": [
        {
            "type": "module",
            "name": "vueport"
        },
        {
            "type": "module",
            "name": "dlopen"
        }
    ],
```

In your module, simply create an element with the class `'vueport-render'` and the Vue component will be created automatically for you using the component name. This does imply that all components need to be globally registered. You can also add the `dependencies` attribute to your element to specify a space-separated list of dependencies to load via `dlopen` (the dependencies need to be registered beforehand).

You can create the element manually via code, or you can embed your Vue components in the middle of your existing handlebars templates : 
```hbs
<div>
  This is in my handlebars template file for module {{ moduleName }}
  <my-vue-port-component class="vueport-render" :my-property="myJSONStringifiedData">
    Loading, please wait... 
    <!--
      the inside of the component will be displayed as a div until the component is loaded and rendered,
      which is practical to show a 'loading...' message while your dependencies are being fetched
    -->
  </my-vue-port-component>
</div>
```

It is highly recommended to have your vue components loaded dynamically by using `dlopen` and adding them as a dependency which your html would specify.

You can also use `VuePort.render` to render a specific component with a custom data object or a vuex store and have it mounted on the element of your choice.
Note that you can render an object directly with `:attr=${JSON.stringify(object)}` if you need to pass a non-string value attribute to a component, as shown in the above hbs example


# Using vue-cli

You can use the vue-cli service to create your vue project, then edit the `package.json` file to add a new script which builds it as a umd library.
```json
   "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint",
    "umd": "vue-cli-service build --target lib --name MyVueComponent src/App.vue"
  },
```

When running the `npm run umd` command, your component (`src/App.vue`) will be compiled into the UMD format and will be available under `dist/MyVueComponent.umd.js` and `dist/MyVueComponent.css`


In your init hook, create a dynamic dependency to load your module's vue components by calling `Dlopen.register` : 
```js
Hooks.on("init", () => {
        Dlopen.register('my-module-name-vue', {
            scripts: "/modules/my-module-name/dist/MyVueComponent.umd.js",
            styles: "/modules/my-module-name/dist/MyVueComponent.css",
            init: () => Vue.component(MyVueComponent.name, MyVueComponent),
            dependencies: "vue"
        });
});
```

You can then have your js and css files loaded automatically as dependencies before the component is displayed. This is practical to avoid loading everything when Foundry boots, but instead loading the Vue components only when the user opens the UI.
```html
<my-vue-component class="vueport-render" dependencies="my-module-name-vue">
    Loading, please wait... 
</my-vue-component>
```

# Using Gulp (DEPRECATED)

Alternatively, you can also use the provided gulp scripts to build only your vue component without the vue dependency packed into it, which results in smaller files. 

Create your .vue files, copy the gulpfile example and rename it, copy the package.json file or install with this command (note gulp-vue-single-file-component is broken in latest version)
`npm install --save gulp gulp-concat gulp-wrap gulp-declare gulp-minify gulp-vue-single-file-component@1.0.12 gulp-babel @babel/core @babel/plugin-transform-modules-commonjs`

run `npm run build` to build your file which has all the components bundled (or run `npx gulp`).
You can also run `npm run watch` to have it build and continually watch your files for any changes and rebuild them automatically (useful during development).

When using the gulp method, the css is not compiled as a separate file, and there is no need for an init function to register the component globally. All `.vue` files in the `vue` folder and subfolders will automatically be registered : 
```js
Hooks.on("init", () => {
        Dlopen.register('my-module-name-vue', {
            scripts: "/modules/my-module-name/dist/vue-components.min.js",
            dependencies: "vue"
        });
});
```

If using the gulp method, you can use a `<style>` section in your .vue file, but if you set it as `scoped`, it won't work. It will load just fine, but the css will be global instead of being scoped.

# Limits

All components are registered globally, so it's important to properly namespace your vue components to avoid conflicts.

# License

This Foundry VTT module, writen by KaKaRoTo, for [The Forge](https://forge-vtt.com), is licensed under a [Creative Commons Attribution-NonCommercial 2.0 Generic License](https://creativecommons.org/licenses/by-nc/2.0/).
