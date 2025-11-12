/**
 * Logger utility that handles logging differently in development vs production
 * Prevents sensitive information from being logged in production
 */

import { env } from './env'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private shouldLog(level: LogLevel): boolean {
    if (env.isDevelopment) {
      return true
    }
    // In production, only log errors and warnings
    return level === 'error' || level === 'warn'
  }

  private sanitize(data: unknown): unknown {
    if (typeof data === 'string') {
      // Remove potential sensitive patterns
      return data.replace(/password|secret|token|key/gi, '[REDACTED]')
    }
    if (typeof data === 'object' && data !== null) {
      const sanitized: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(data)) {
        if (/password|secret|token|key|authorization/i.test(key)) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = this.sanitize(value)
        }
      }
      return sanitized
    }
    return data
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(`[INFO] ${message}`, context ? this.sanitize(context) : '')
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, context ? this.sanitize(context) : '')
    }
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error && env.isDevelopment ? error.stack : undefined
      const sanitizedContext = context ? this.sanitize(context) : {}
      console.error(`[ERROR] ${message}`, {
        error: errorMessage,
        stack: errorStack,
        ...(typeof sanitizedContext === 'object' && sanitizedContext !== null ? sanitizedContext : {}),
      })
    }
  }

  debug(message: string, context?: LogContext): void {
    if (env.isDevelopment && this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, context ? this.sanitize(context) : '')
    }
  }
}

export const logger = new Logger()

