import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => ({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tanstackStart({
      srcDirectory: 'src',
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false, // Tắt mặt định build static , chỉ build khi cần định nghĩa (mặt định của tanstack start)
        crawlLinks: false,
      },
      pages: [
        {
          path: '/',
          prerender: { enabled: true },
        },
      ],
    }),

    nitro(), // tự host Node  dùng cho Node/VPS/Docker/Railway: giữ nitro(), chạy node .output/server/index.mjs vì nó đc đóng gói sẵn là 1 server rồi ===> server runtime chạy được trực tiếp
    tailwindcss(),
    viteReact(),
    devtools(),
  ],
}))

// Vercel docs hiện tại nói TanStack Start chạy trên Vercel khi paired với Nitro; Vercel tự detect TanStack Start + Nitro, build server thành Vercel
// Thường không cần vercel.json. Nếu Vercel detect sai framework, thêm: { "framework": "tanstack-start" }
