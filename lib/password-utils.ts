export type PasswordStrengthLevel = 'weak' | 'medium' | 'strong'

export interface PasswordStrength {
  score: number
  level: PasswordStrengthLevel
}

export function evaluatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, level: 'weak' }
  }

  let score = 0
  const lengthScore = Math.min(password.length, 14) / 14
  score += lengthScore * 40

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  const varietyCount = [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length
  score += varietyCount * 15

  if (hasNumber && hasSymbol && password.length >= 10) {
    score += 10
  }

  const normalizedScore = Math.min(100, Math.round(score))

  let level: PasswordStrengthLevel = 'weak'
  if (normalizedScore >= 75) {
    level = 'strong'
  } else if (normalizedScore >= 45) {
    level = 'medium'
  }

  return { score: normalizedScore, level }
}
