import { db } from '@/lib/db'
import type { ProductPayload } from '@/validators/product.validator'

type ProductRecord = ProductPayload & {
  id: string
  priceInPaise: number
}

export async function createProductRecord(
  payload: ProductPayload & { priceInPaise: number },
) {
  // Replace with a Drizzle insert once product schema is available.
  return db.query<ProductRecord>('products.create', payload)
}

export async function findProductById(productId: string) {
  // Replace with a Drizzle select by id.
  return db.query<ProductRecord | null>('products.findById', { productId })
}

export async function updateProductRecord(
  productId: string,
  payload: ProductPayload & { priceInPaise: number },
) {
  // Replace with a Drizzle update by id.
  return db.query<ProductRecord>('products.update', { productId, ...payload })
}
