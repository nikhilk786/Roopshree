'use server'

import { requireAdmin } from '@/lib/auth'
import { validateProductPayload } from '@/validators/product.validator'
import { createProduct, updateProduct } from '@/services/product.service'

export async function createProductAction(payload: unknown) {
  await requireAdmin()

  const data = validateProductPayload(payload)

  return createProduct(data)
}

export async function updateProductAction(productId: string, payload: unknown) {
  await requireAdmin()

  const data = validateProductPayload(payload)

  return updateProduct(productId, data)
}
