// Demo mode email service - outputs to console instead of sending real emails

import { logger } from './logger'
import { env } from './env'

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}`
  
  // Demo mode: output to console (only in development)
  if (env.isDevelopment) {
    logger.info('Email verification link', {
      email,
      verificationUrl,
    })
  }
  
  // In production, you would send a real email here
  // Example with Resend:
  // await resend.emails.send({
  //   from: 'noreply@yourdomain.com',
  //   to: email,
  //   subject: 'Verify your email',
  //   html: `<a href="${verificationUrl}">Click here to verify your email</a>`
  // })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${APP_URL}/api/auth/reset-password?token=${token}`
  
  // Demo mode: output to console (only in development)
  if (env.isDevelopment) {
    logger.info('Password reset link', {
      email,
      resetUrl,
    })
  }
  
  // In production, you would send a real email here
}

