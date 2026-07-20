import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface VerificationEmailProps {
  name: string
  code: string
  purpose?: 'verification' | 'reset-password'
}

export function VerificationEmail({
  name,
  code,
  purpose = 'verification',
}: VerificationEmailProps) {
  const isReset = purpose === 'reset-password'
  return (
    <Html>
      <Head />
      <Preview>
        {isReset
          ? 'Reset your password for NodeSpace'
          : 'Verify your email address for NodeSpace'}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>
            {isReset ? 'Reset Password Request' : 'Welcome to NodeSpace!'}
          </Heading>
          <Text style={paragraph}>Hi {name},</Text>
          <Text style={paragraph}>
            {isReset
              ? 'We received a request to reset your password. Please use the following 6-digit verification code to complete the password reset process:'
              : 'Thanks for creating an account on NodeSpace. To get started and unlock full access to your workspace, please use the following 6-digit verification code:'}
          </Text>
          <Section style={codeBoxContainer}>
            <div style={codeBox}>{code}</div>
          </Section>
          <Text style={paragraph}>
            This code will expire in 10 minutes. If you did not request this
            code, you can safely ignore this email.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>NodeSpace Team</Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#0a0a0c',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#111115',
  border: '1px solid #222226',
  borderRadius: '12px',
  margin: '0 auto',
  padding: '40px 30px',
  maxWidth: '560px',
}

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
}

const paragraph = {
  color: '#c5c5d2',
  fontSize: '15px',
  lineHeight: '26px',
  margin: '16px 0',
}

const codeBoxContainer = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const codeBox = {
  backgroundColor: '#1f1f2e',
  border: '1px solid #7c3aed',
  borderRadius: '8px',
  padding: '16px',
  fontSize: '32px',
  fontWeight: 'bold',
  letterSpacing: '8px',
  textAlign: 'center' as const,
  color: '#a78bfa',
  display: 'inline-block',
  minWidth: '200px',
}

const hr = {
  borderColor: '#222226',
  margin: '30px 0',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '22px',
  wordBreak: 'break-all' as const,
}
export default VerificationEmail
