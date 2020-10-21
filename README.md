# VuePort!

Library that makes it easy to integrate Vue within Foundry VTT

Create your .vue files, copy the gulpfile example and rename it, copy the package.json file or install with these (note gulp-vue-single-file-component is broken in latest version)
`npm install --save gulp gulp-concat gulp-wrap gulp-declare gulp-minify gulp-vue-single-file-component@1.0.12 gulp-babel @babel/plugin-transform-modules-commonjs`

run `npm run build` to build your file which has all the components bundled.

Any time you add to the DOM an element with the class "vueport-render", it will automatically be replaced by a Vue instance.
You can set its own dependencies with the 'dependencies' attribute as space separated values.
You can then use Dlopen to add a dependency to your own components for the element.
You can also use VuePort.render to render a specific component with a custom data object or a vuex store and have it mounted on the element of your choice.
Note that you can render an object directly with `:attr=${JSON.stringify(object)}` if you need to pass a non-string value attribute to a component

See hello world example on how you can load your vue components dynamically.

# Limits

All components are registered globally, so it's important to properly namespace your vue components to avoid conflicts. It's probably doable but I simply don't use "import", and all components are self contained, and if I need to import an external library, I much prefer to use Dlopen for that.

You can use a `<style>` section in your .vue file, but if you set it as `scoped`, it won't work. It will load just fine, but the css will be global instead of being scoped.

# License

This Foundry VTT module, writen by KaKaRoTo, for [The Forge](https://forge-vtt.com), is licensed under a [Creative Commons Attribution-NonCommercial 2.0 Generic License](https://creativecommons.org/licenses/by-nc/2.0/).
