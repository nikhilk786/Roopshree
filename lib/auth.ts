type SessionUser = {
  id: string
  email: string
  role: 'user' | 'admin'
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  // Wire this to your auth provider/session store.
  return null
}

export async function requireUser() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireAdmin() {
  const user = await requireUser()

  if (user.role !== 'admin') {
    throw new Error('Forbidden')
  }

  return user
}
