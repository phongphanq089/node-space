import '@/styles.css'

import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Footer from '@/components/Footer'
import Header from '@/components/Header'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'NodeSpace — Your thoughts. Connected.' },
      {
        name: 'description',
        content:
          'NodeSpace là không gian ghi chú dạng node thế hệ mới — giúp bạn tư duy tự do và kết nối ý tưởng.',
      },
    ],
  }),
  shellComponent: RootDocument,
})

// Routes that use their own full-page layout (no shared Header/Footer)
const STANDALONE_ROUTES = ['/dashboard', '/login', '/register']

function RootDocument({ children }: { children: React.ReactNode }) {
  const location = useRouterState({ select: (s) => s.location })
  const isStandalone = STANDALONE_ROUTES.some((r) =>
    location.pathname.startsWith(r)
  )

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans wrap-anywhere antialiased selection:bg-[rgba(79,184,178,0.24)]">
        {!isStandalone && <Header />}
        {children}
        {!isStandalone && <Footer />}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
