import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
    { files: ["**/*.{js,mjs,cjs,vue}"], ignores: ["**/dist/**/*"] },
    { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
    {
        languageOptions: {
            globals: {
                ...globals.node,
                $: "readonly",
                canvas: "readonly",
                Dialog: "readonly",
                Dlopen: "readonly",
                game: "readonly",
                Hooks: "readonly",
                SoundCloud: "readonly",
                ui: "readonly",
                Vue: "readonly",
                Vuex: "readonly",
                VueMoveable: "readonly"
            }
        }
    },
    pluginJs.configs.recommended,
    ...pluginVue.configs["flat/essential"]
];
