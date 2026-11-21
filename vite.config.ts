import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const pages = ['index', 'learning', 'education', 'foundry', 'about', 'connect', 'careers']

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p, resolve(__dirname, `${p}.html`)])),
    },
  },
})
