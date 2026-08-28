import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const isDev = process.env.NODE_ENV !== 'production'

export default defineConfig(() => ({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    port: 3000,
  },
  esbuild: isDev
    ? undefined
    : {
        drop: ['debugger'] as ('console' | 'debugger')[],
      },
  resolve: {
    tsconfigPaths: true,
  },
  ssr: {
    noExternal: ['sonner'],
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
    isDev &&
      devtools({
        injectSource: {
          enabled: true,
          ignore: {
            // __root.tsx renders the HTML shell (<html>/<head>/<body>) via SSR.
            // The transform produces different line numbers on server vs client,
            // causing a hydration mismatch for every data-tsd-source attribute.
            files: [/routes\/__root\.tsx/],
          },
        },
      }),
  ],
}))
