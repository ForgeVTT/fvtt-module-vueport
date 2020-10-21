"use strict";
class VuePort {
    static init() {
        game.settings.register("vueport", "debug", {
            name: game.i18n.localize("VUEPORT.debug"),
            hint: game.i18n.localize("VUEPORT.debugHint"),
            scope: "client",
            config: true,
            default: false,
            type: Boolean
        });
    }
    static setup() {
        const debug = game.settings.get("vueport", "debug");
        Dlopen.register('vue', {
            scripts: `https://cdn.jsdelivr.net/npm/vue/dist/vue${debug ? ".min": ""}.js`,
            init: () => {
                Vue.config.devtools = debug;
                
                // Expose Foundry objects as global object in Vue plugin
                Vue.use({
                    install(Vue, options) {
                        Vue.prototype.ui = ui;
                        Vue.prototype.game = game;
                        Vue.prototype.canvas = canvas;
                    },
                })
            }
        });
        Dlopen.register('vuex', {
            scripts: `https://unpkg.com/vuex@2.0.0/dist/vuex${debug ? ".min": ""}.js`,
            dependencies: "vue",
            init: () => Vue.use(Vuex)
        });
        const observer = new window.MutationObserver(VuePort._documentModified.bind(VuePort));
        observer.observe(document, { "subtree": true, "childList": true });
        this._autoRender();
    }
    static async render(template, element, {data = {}, store = null, dependencies=[], renderData}={}) {
        const vueDeps = ['vue'];
        if (store) vueDeps.push('vuex');
        await Dlopen.loadDependencies(vueDeps.concat(dependencies));
        return new Vue({
            render: template ? h => h(this.Components[template], renderData) : undefined,
            el: element,
            data,
            store
          });
    }

    static async _autoRender(element) {
        const components = $(element).find(".vueport-render").addBack(".vueport-render");
        for (let el of components.toArray()) {
            const id = el.id || "vueApp";
            const deps = el.getAttribute("dependencies") || undefined;
            // Can't change the class after render because the element won't exist anymore and there's no guarantee
            // that the Vue element itself won't be a comment/lazy-loaded.
            // Also, we don't want to re-trigger the mutation observer on the vue content
            el.classList.remove("vueport-render");
            el.classList.add("vueport-rendered");
            this[id] = await this.render(null, el, {dependencies: deps && deps.split(" ")});
        }
    }
    static async _documentModified(mutations, observer) {
        const addedNodes = mutations.reduce((nodes, mutation) => nodes.concat(...mutation.addedNodes), [])
        return this._autoRender(addedNodes);
    }
    static async loadCss(config) {
        return Dlopen.loadCss(config);
    }
}

VuePort.VueComponents = {};

Hooks.on('init', () => VuePort.init());
Hooks.on('setup', () => VuePort.setup());