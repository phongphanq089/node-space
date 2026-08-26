import '@/styles.css'

// import { TanStackDevtools } from '@tanstack/react-devtools'
import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
// import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { DefaultCatchBoundary } from '@/shared/ui/system/default-catch-boundary'
import { Toaster } from '@/shared/ui/core/sonner'
import { seo } from '@/shared/lib/utils'

import { useEffect } from 'react'
import { useThemeStore } from '@/shared/stores/use-theme-store'

// Inline theme init — runs synchronously before React hydration to completely prevent flash (FOUC)
const THEME_INIT_SCRIPT = `(function(){
  try {
    var raw = localStorage.getItem('nodespace-theme');
    var theme = raw ? JSON.parse(raw) : null;
    var state = theme && theme.state ? theme.state : {};
    var mode = state.mode || 'dark';
    var accent = state.accent || 'violet';
    var customColor = state.customColor || '';

    var isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var root = document.documentElement;

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    root.setAttribute('data-accent', accent);
    if (accent === 'custom' && customColor) {
      root.style.setProperty('--ns-primary', customColor);
      root.style.setProperty('--ns-primary-lt', customColor);
    }
  } catch (e) {}
})();`

const SITE_URL = 'https://noteFlow.com'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        name: 'application-name',
        content: 'Note Flow',
      },
      ...seo({
        title: 'Note Flow — Smart Workspace for Notes & Ideas',
        description:
          'Note Flow is a powerful note-taking workspace. Organize your thoughts with notebooks, folders, tags, and a clean distraction-free editor. Built for writers, developers, and thinkers.',
        keywords:
          'note taking app, workspace, notebooks, knowledge management, productivity app, notes organizer, folders, tags, ideas, writing tool, Note Flow',
        image: `${SITE_URL}/hero-banner.png`,
        url: SITE_URL,
      }),
    ],
    links: [
      { rel: 'canonical', href: SITE_URL },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        tag: 'script',
        attrs: {
          type: 'application/ld+json',
        },
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: 'Note Flow',
          url: SITE_URL,
          description:
            'A powerful note-taking workspace to organize your thoughts with notebooks, folders, tags, and a clean distraction-free editor.',
          applicationCategory: 'ProductivityApplication',
          operatingSystem: 'Web',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          author: {
            '@type': 'Person',
            name: 'Phong Phan',
            url: SITE_URL,
            sameAs: [
              'https://github.com/phongphanq089',
              'https://linkedin.com/in/phongphan',
            ],
          },
          featureList: [
            'Note taking',
            'Notebook organization',
            'Folder management',
            'Tagging system',
            'Workspace collaboration',
            'Pinned notes',
            'Trash & recovery',
          ],
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
  errorComponent: DefaultCatchBoundary,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const cleanup = useThemeStore.getState().initThemeListener()
    return () => cleanup()
  }, [])

  return (
    <html
      lang="en"
      className="dark"
      data-theme="dark"
      data-accent="violet"
      suppressHydrationWarning
    >
      <head suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body
        className="font-sans wrap-anywhere antialiased"
        suppressHydrationWarning
      >
        <Toaster richColors />
        {children}
        {/* <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtools />,
            },
          ]}
        /> */}
        {/* <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools buttonPosition="bottom-left" /> */}
        <Scripts />
      </body>
    </html>
  )
}
