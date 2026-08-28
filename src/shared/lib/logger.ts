/**
 * Universal Logger for Dev & Production
 * - Clean ANSI formatting supported in Terminal, Vite Relay, and Browser DevTools
 * - Automatically silences debug/info/success logs in Production
 */

const isDev =
  process.env.NODE_ENV !== 'production' ||
  (typeof import.meta !== 'undefined' && Boolean((import.meta as any).env?.DEV))

// ANSI colors & styles (Supported in Terminal + modern Browser DevTools)
const ANSI = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
}

function getTimeStamp(): string {
  const d = new Date()
  return d.toTimeString().split(' ')[0]
}

function formatPrefix(tag: string, symbol: string, color: string): string {
  const time = getTimeStamp()
  return `${ANSI.gray}[${time}]${ANSI.reset} ${color}${ANSI.bold}[${tag.toUpperCase()}]${ANSI.reset} ${color}${symbol}${ANSI.reset}`
}

export const logger = {
  info: (tag: string, message: string, ...args: any[]) => {
    if (!isDev) return
    console.log(`${formatPrefix(tag, 'ℹ', ANSI.cyan)} ${message}`, ...args)
  },

  success: (tag: string, message: string, ...args: any[]) => {
    if (!isDev) return
    console.log(`${formatPrefix(tag, '✔', ANSI.green)} ${message}`, ...args)
  },

  debug: (tag: string, message: string, ...args: any[]) => {
    if (!isDev) return
    console.debug(
      `${formatPrefix(tag, '🔍', ANSI.magenta)} ${message}`,
      ...args
    )
  },

  warn: (tag: string, message: string, ...args: any[]) => {
    console.warn(`${formatPrefix(tag, '⚠', ANSI.yellow)} ${message}`, ...args)
  },

  error: (tag: string, message: string, error?: any, ...args: any[]) => {
    console.error(
      `${formatPrefix(tag, '✖', ANSI.red)} ${message}`,
      error !== undefined ? error : '',
      ...args
    )
  },
}

/**
 * Helper to create a logger instance scoped to a specific tag
 * Example: const d1Log = createScopedLogger('D1')
 *          d1Log.success('Connected successfully!')
 */
export function createScopedLogger(tag: string) {
  return {
    info: (message: string, ...args: any[]) =>
      logger.info(tag, message, ...args),
    success: (message: string, ...args: any[]) =>
      logger.success(tag, message, ...args),
    debug: (message: string, ...args: any[]) =>
      logger.debug(tag, message, ...args),
    warn: (message: string, ...args: any[]) =>
      logger.warn(tag, message, ...args),
    error: (message: string, error?: any, ...args: any[]) =>
      logger.error(tag, message, error, ...args),
  }
}
