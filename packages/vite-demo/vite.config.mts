import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import AutoImport from "unplugin-auto-import/vite";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import Components from "unplugin-vue-components/vite";
import UnoCSS from 'unocss/vite'
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_BASE || '/',
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        // 這個 import 陣列非常重要，他就是告訴我們的 vite ，哪些哪些 API 要自動引入
        imports: [
          "vue",
           "vue-router"
          ],
        dts: true,
      }),
      Pages(),
      Layouts(),
      Components({
        // 從 `./src/components/` 路徑查找
        extensions: ["vue"],
        include: [/\.vue$/, /\.vue\?vue/],
        dts: "src/auto-components.ts",
        deep: true,//搜尋子目錄
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      cors: true,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true
        }
      }
    }
  }
})