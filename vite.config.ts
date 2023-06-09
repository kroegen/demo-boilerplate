import { fileURLToPath, URL } from "node:url";
import svgLoader from "vite-svg-loader";
import { resolve, dirname } from "node:path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader({ defaultImport: "raw" }),
    VueI18nPlugin({
      /* options */
      // locale messages resource pre-compile option
      include: resolve(
        dirname(fileURLToPath(import.meta.url)),
        "./path/to/src/locales/**"
      ),
      runtimeOnly: false,
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
