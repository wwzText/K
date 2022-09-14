import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite';
import alias from "@rollup/plugin-alias";
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
      web3: path.resolve(__dirname, './node_modules/web3/dist/web3.min.js'),
    }
  },

  plugins: [
    alias(),
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    AutoImport({
      // 自动引用 vue api 
      imports: ['vue', 'vue-router', 'pinia'],
      // 说明文件
      dts: "src/auto-import.d.ts",
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        charset: false,
        additionlData: `@import "${path.resolve(__dirname, '/src/assets/css/base.less')}"`
      }
    }
  },
  define: {
    'process.env': {}
  },
  server:{
    host: '0.0.0.0'
  }
})
