import { db } from '@/lib/db'

type UserRecord = {
  id: string
  email: string
  role: 'user' | 'admin'
}

export async function listUsers() {
  // Replace with a Drizzle select from users.
  return db.query<UserRecord[]>('users.list')
}

export async function getUserById(userId: string) {
  // Replace with a Drizzle select by id.
  return db.query<UserRecord | null>('users.findById', { userId })
}
