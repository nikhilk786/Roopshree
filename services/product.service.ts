import {
  createProductRecord,
  findProductById,
  updateProductRecord,
} from '@/repositories/product.repository'
import type { ProductPayload } from '@/validators/product.validator'

export async function createProduct(payload: ProductPayload) {
  const priceInPaise = Math.round(payload.price * 100)

  return createProductRecord({
    ...payload,
    priceInPaise,
  })
}

export async function updateProduct(productId: string, payload: ProductPayload) {
  const product = await findProductById(productId)

  if (!product) {
    throw new Error('Product not found')
  }

  return updateProductRecord(productId, {
    ...payload,
    priceInPaise: Math.round(payload.price * 100),
  })
}
