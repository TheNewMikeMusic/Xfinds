import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')

export interface User {
  id: string
  email: string
  password: string // In production, this should be hashed
  createdAt: string
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
  return JSON.parse(fileContents)
}

export function writeUsers(users: User[]): void {
  ensureUsersFile()
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function getUserByEmail(email: string): User | null {
  const users = readUsers()
  return users.find((u) => u.email === email) || null
}

export function createUser(email: string, password: string): User {
  const users = readUsers()
  const user: User = {
    id: `user-${Date.now()}`,
    email,
    password, // In production, hash this
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  writeUsers(users)
  return user
}

