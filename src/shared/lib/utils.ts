import { clsx } from 'clsx'
import type { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const seo = ({
  title,
  description,
  keywords,
  image,
  url,
  noindex = false,
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
  url?: string
  noindex?: boolean
}) => {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    {
      name: 'robots',
      content: noindex ? 'noindex, nofollow' : 'index, follow',
    },
    { name: 'theme-color', content: '#0a0a0a' },
    // Twitter Card
    {
      name: 'twitter:card',
      content: image ? 'summary_large_image' : 'summary',
    },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:site', content: '@nodespaceapp' },
    { name: 'twitter:creator', content: '@nodespaceapp' },
    // Open Graph — phải dùng `property`, không phải `name`
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Note Flow' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:locale', content: 'en_US' },
    ...(url ? [{ property: 'og:url', content: url }] : []),
    ...(image
      ? [
          { property: 'og:image', content: image },
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
          { property: 'og:image:alt', content: title },
          { name: 'twitter:image', content: image },
          { name: 'twitter:image:alt', content: title },
        ]
      : []),
  ]

  return tags
}

export const jsonLd = (data: unknown) => {
  return {
    tag: 'script',
    attrs: {
      type: 'application/ld+json',
    },
    children: JSON.stringify(data),
  }
}
