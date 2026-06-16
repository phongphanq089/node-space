import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

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
    devtools(),
  ],
}))

// Vercel docs hiện tại nói TanStack Start chạy trên Vercel khi paired với Nitro; Vercel tự detect TanStack Start + Nitro, build server thành Vercel
// Thường không cần vercel.json. Nếu Vercel detect sai framework, thêm: { "framework": "tanstack-start" }
