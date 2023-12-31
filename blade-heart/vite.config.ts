import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import sass from 'vite-plugin-sass'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), sass()],
})
