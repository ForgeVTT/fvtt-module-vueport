class VuePortHelloWorld {
    static init() {
        // Register dependencies for vue-moveable and vue-soundcloud-player
        Dlopen.register("vue-moveable", {
            scripts: "https://unpkg.com/vue-moveable@1.8.9/dist/lib/VueMoveable.umd.min.js",
            dependencies: "vue",
            init: () => Vue.component(VueMoveable.name, VueMoveable)
        });
        Dlopen.register("classnames", {
            scripts: "https://unpkg.com/classnames@2.2.6/index.js", // classnames dependency of soundcloud player
            init: () => {
                // Need to set classnames correctly because anything that depends on it for UMD will fail to find it
                window.classnames = window.classNames;
            }
        });
        Dlopen.register("vue-soundcloud-player", {
            scripts: [
                // "https://unpkg.com/classnames@2.2.6/index.js", // can't load it this way because of the classnames/classNames issue in the file definition
                "https://unpkg.com/vue-soundcloud-player@1.2.0/dist/index.js"
            ],
            dependencies: ["vue", "classnames"],
            init: () => Vue.component(SoundCloud.default.name, SoundCloud.default)
        });

        // Define dependency on our own custom vue components for when we need it
        Dlopen.register("vueport-hello-world", {
            scripts: "/modules/vueport-hello-world/dist/vue-components.min.js",
            dependencies: ["vue-moveable", "vue-soundcloud-player"]
        });
    }
    static run(message) {
        const match = message.data.content.toLowerCase().match(/vueport soundcloud(?::\s*([0-9]+))?/);
        if (match) {
            const trackId = match[1] || "10400738";
            const d = new Dialog(
                {
                    content: `<vue-port-hello-world class="vueport-render" dependencies='vueport-hello-world' track="${trackId}" :mini="true">Loading, please wait...</vue-port-hello-world>`,
                    buttons: {}
                },
                { height: "auto", resizable: true, popOutModuleDisable: true }
            ).render(true);
            // Auto resize after 2 seconds
            setTimeout(() => d.setPosition(), 2000);
        }
    }
}
Hooks.on("init", () => VuePortHelloWorld.init());
Hooks.on("createChatMessage", (m) => VuePortHelloWorld.run(m));
