import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  base:'/blade-heart',
  plugins: [preact()],
  resolve: {
    alias: {
      '~': './src',
      '@utils': './src/utils',
    },
  },
})
