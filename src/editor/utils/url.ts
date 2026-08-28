const SUPPORTED_URL_PROTOCOLS = new Set([
  'http:',
  'https:',
  'mailto:',
  'sms:',
  'tel:',
])

export function sanitizeUrl(url: string): string {
  try {
    const parsedUrl = new URL(url)
    if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
      return 'about:blank'
    }
  } catch {
    return url
  }
  return url
}

export function validateUrl(url: string): boolean {
  return (
    url === 'https://' ||
    url === 'http://' ||
    /^(https?:\/\/|mailto:|tel:)[^\s/$.?#].[^\s]*$/i.test(url)
  )
}
