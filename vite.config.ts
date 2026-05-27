import netlify from '@netlify/vite-plugin-tanstack-start'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const config = defineConfig({
  plugins: [
    tsconfigPaths(),
    devtools(),
    netlify(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
