import { env } from 'cloudflare:workers'
import { logger } from './logger'

export interface SendEmailParams {
  to: string
  subject: string
  htmlContent: string
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  const rawApiKey = process.env.BREVO_API_KEY || (env as any).BREVO_API_KEY
  const rawSenderEmail =
    process.env.BREVO_SENDER_EMAIL || (env as any).BREVO_SENDER_EMAIL
  const rawSenderName =
    process.env.BREVO_SENDER_NAME || (env as any).BREVO_SENDER_NAME

  const apiKey = rawApiKey?.replace(/^["']|["']$/g, '')
  const senderEmail =
    rawSenderEmail?.replace(/^["']|["']$/g, '') ||
    'phongphan.developer.q089@gmail.com'
  const senderName = rawSenderName?.replace(/^["']|["']$/g, '') || 'NodeSpace'

  logger.debug('EMAIL', 'Brevo Config:', {
    hasRawKey: !!rawApiKey,
    rawKeyLength: rawApiKey?.length,
    apiKeyLength: apiKey?.length,
    apiKeyStart: apiKey
      ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 5)}`
      : 'undefined',
    senderEmail,
    senderName,
  })

  if (!apiKey) {
    logger.warn('EMAIL', 'BREVO_API_KEY is not set. Simulated email sending:')
    logger.info('EMAIL', `To: ${to}\nSubject: ${subject}`)
    return { success: true, simulated: true }
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    }),
  })

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as any
    console.error('❌ Failed to send email via Brevo:', errorData)
    throw new Error(errorData?.message || 'Failed to send email')
  }

  return await response.json()
}
