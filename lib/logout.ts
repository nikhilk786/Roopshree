'use client'

import { signOutAction } from '@/actions/auth.action'

export async function logout() {
  await signOutAction()
}
