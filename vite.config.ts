import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig(() => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: false,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
      },
    }),
    tailwindcss(),
    viteReact(),
    isDev && devtools(),
  ],
}))
