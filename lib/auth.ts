import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

const DATA_DIR = join(process.cwd(), 'data')

export interface User {
  id: string
  email: string
  password: string // Hashed password
  emailVerified: boolean
  emailVerificationToken: string | null
  emailVerificationExpiry: string | null
  name: string | null
  createdAt: string
  updatedAt: string
}

const USERS_FILE = join(DATA_DIR, 'users.json')

function ensureUsersFile() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!existsSync(USERS_FILE)) {
    writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8')
  }
}

export function readUsers(): User[] {
  ensureUsersFile()
  const fileContents = readFileSync(USERS_FILE, 'utf-8')
  const users = JSON.parse(fileContents)
  // Migrate old users to new format
  return users.map((user: any) => ({
    ...user,
    emailVerified: user.emailVerified ?? false,
    emailVerificationToken: user.emailVerificationToken ?? null,
    emailVerificationExpiry: user.emailVerificationExpiry ?? null,
    name: user.name ?? null,
    updatedAt: user.updatedAt ?? user.createdAt,
  }))
}

export function writeUsers(users: User[]): void {
  ensureUsersFile()
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function getUserByEmail(email: string): User | null {
  const users = readUsers()
  return users.find((u) => u.email === email) || null
}

export function getUserById(id: string): User | null {
  const users = readUsers()
  return users.find((u) => u.id === id) || null
}

export function generateToken(): string {
  return randomBytes(32).toString('hex')
}

export function createUser(email: string, password: string, name?: string): User {
  const users = readUsers()
  
  // Hash password
  const hashedPassword = bcrypt.hashSync(password, 10)
  
  // Generate verification token
  const verificationToken = generateToken()
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
  
  const now = new Date().toISOString()
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    password: hashedPassword,
    emailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationExpiry: verificationExpiry,
    name: name || null,
    createdAt: now,
    updatedAt: now,
  }
  users.push(user)
  writeUsers(users)
  return user
}

export function verifyPassword(plainPassword: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword)
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = readUsers()
  const userIndex = users.findIndex((u) => u.id === userId)
  
  if (userIndex === -1) return null
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  
  writeUsers(users)
  return users[userIndex]
}

export function verifyEmailToken(token: string): User | null {
  const users = readUsers()
  const user = users.find(
    (u) =>
      u.emailVerificationToken === token &&
      u.emailVerificationExpiry &&
      new Date(u.emailVerificationExpiry) > new Date()
  )
  
  if (!user) return null
  
  // Update user to verified
  const userIndex = users.findIndex((u) => u.id === user.id)
  users[userIndex] = {
    ...user,
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpiry: null,
    updatedAt: new Date().toISOString(),
  }
  
  writeUsers(users)
  return users[userIndex]
}

export function generateNewVerificationToken(email: string): string | null {
  const user = getUserByEmail(email)
  if (!user) return null
  
  const token = generateToken()
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  
  updateUser(user.id, {
    emailVerificationToken: token,
    emailVerificationExpiry: expiry,
  })
  
  return token
}

