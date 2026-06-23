import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      vue: '@dcloudio/uni-h5-vue/dist/vue.runtime.esm.js'
    }
  },
  server: {
    port: 8080,
    host: '0.0.0.0'
  }
})
