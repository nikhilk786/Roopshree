import { and, asc, countDistinct, desc, eq, ne } from 'drizzle-orm'
import {
  categories,
  mediaAssets,
  productCategories,
  productAttributes,
  productMedia,
  products,
  productVariants,
} from '@/db'
import { db } from '@/lib/db'
import type { ProductPayload } from '@/validators/product.validator'

type ProductRecord = ProductPayload & {
  id: string
  priceInPaise: number
}

export async function createProductRecord(
  payload: ProductPayload & { priceInPaise: number },
): Promise<ProductRecord> {
  void db
  void payload

  // Replace with a Drizzle insert once product schema is available.
  throw new Error('Product create query not implemented')
}

export async function findProductById(
  productId: string,
): Promise<ProductRecord | null> {
  void db
  void productId

  // Replace with a Drizzle select by id.
  return null satisfies ProductRecord | null
}

export async function updateProductRecord(
  productId: string,
  payload: ProductPayload & { priceInPaise: number },
): Promise<ProductRecord> {
  void db
  void productId
  void payload

  // Replace with a Drizzle update by id.
  throw new Error('Product update query not implemented')
}

export type ProductListQuery = {
  limit?: number
  offset?: number
  categorySlug?: string
  featured?: boolean
  sortBy?: 'featured' | 'newest' | 'price-low' | 'price-high'
}

export type ProductListRow = {
  id: string
  slug: string
  name: string
  sku: string
  basePrice: number
  strikeThroughPrice: number | null
  variantId: string | null
  variantTitle: string | null
  variantPrice: number | null
  variantStrikeThroughPrice: number | null
  color: string | null
  imageKey: string | null
  imageAlt: string | null
}

export type CategoryListRow = {
  id: string
  name: string
  slug: string
  imageKey: string | null
}

export type ProductDetailRow = {
  id: string
  slug: string
  name: string
  sku: string
  shortDescription: string | null
  description: string | null
  basePrice: number
  strikeThroughPrice: number | null
}

export type ProductDetailVariantRow = {
  id: string
  title: string
  sku: string
  price: number
  strikeThroughPrice: number | null
  stockQuantity: number
  color: string | null
  fabric: string | null
  size: string | null
  isDefault: boolean
}

export type ProductDetailMediaRow = {
  id: string
  key: string
  altText: string | null
  variantId: string | null
  isPrimary: boolean
  sortOrder: number
}

export type ProductDetailAttributeRow = {
  id: string
  name: string
  value: string
  sortOrder: number
}

function getProductWhere(query: ProductListQuery) {
  return and(
    ne(products.status, 'archived'),
    query.featured === undefined
      ? undefined
      : eq(products.isFeatured, query.featured),
    query.categorySlug ? eq(categories.slug, query.categorySlug) : undefined,
  )
}

function getProductOrder(query: ProductListQuery) {
  if (query.sortBy === 'price-low') {
    return asc(productVariants.price)
  }

  if (query.sortBy === 'price-high') {
    return desc(productVariants.price)
  }

  if (query.sortBy === 'newest') {
    return desc(products.createdAt)
  }

  return desc(products.isFeatured)
}

export async function listProductRows(
  query: ProductListQuery = {},
): Promise<ProductListRow[]> {
  return db
    .selectDistinctOn([products.id], {
      id: products.id,
      slug: products.slug,
      name: products.name,
      sku: products.sku,
      basePrice: products.basePrice,
      strikeThroughPrice: products.strikeThroughPrice,
      variantId: productVariants.id,
      variantTitle: productVariants.title,
      variantPrice: productVariants.price,
      variantStrikeThroughPrice: productVariants.strikeThroughPrice,
      color: productVariants.color,
      imageKey: mediaAssets.key,
      imageAlt: mediaAssets.altText,
    })
    .from(products)
    .leftJoin(
      productVariants,
      and(
        eq(productVariants.productId, products.id),
        eq(productVariants.isDefault, true),
        eq(productVariants.isActive, true),
      ),
    )
    .leftJoin(productCategories, eq(productCategories.productId, products.id))
    .leftJoin(categories, eq(categories.id, productCategories.categoryId))
    .leftJoin(
      productMedia,
      and(
        eq(productMedia.productId, products.id),
        eq(productMedia.isPrimary, true),
      ),
    )
    .leftJoin(mediaAssets, eq(mediaAssets.id, productMedia.mediaAssetId))
    .where(getProductWhere(query))
    .orderBy(products.id, getProductOrder(query), asc(products.name))
    .limit(query.limit ?? 12)
    .offset(query.offset ?? 0)
}

export async function countProductRows(query: ProductListQuery = {}) {
  const [row] = await db
    .select({ count: countDistinct(products.id) })
    .from(products)
    .leftJoin(productCategories, eq(productCategories.productId, products.id))
    .leftJoin(categories, eq(categories.id, productCategories.categoryId))
    .where(getProductWhere(query))

  return row?.count ?? 0
}

export async function listCategoryRows(limit = 12): Promise<CategoryListRow[]> {
  return db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      imageKey: categories.bannerImage,
    })
    .from(categories)
    .orderBy(asc(categories.name))
    .limit(limit)
}

export async function findProductDetailBySlug(slug: string) {
  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      sku: products.sku,
      shortDescription: products.shortDescription,
      description: products.description,
      basePrice: products.basePrice,
      strikeThroughPrice: products.strikeThroughPrice,
    })
    .from(products)
    .where(and(eq(products.slug, slug), ne(products.status, 'archived')))
    .limit(1)

  return product ?? null
}

export async function listProductDetailVariants(
  productId: string,
): Promise<ProductDetailVariantRow[]> {
  return db
    .select({
      id: productVariants.id,
      title: productVariants.title,
      sku: productVariants.sku,
      price: productVariants.price,
      strikeThroughPrice: productVariants.strikeThroughPrice,
      stockQuantity: productVariants.stockQuantity,
      color: productVariants.color,
      fabric: productVariants.fabric,
      size: productVariants.size,
      isDefault: productVariants.isDefault,
    })
    .from(productVariants)
    .where(
      and(
        eq(productVariants.productId, productId),
        eq(productVariants.isActive, true),
      ),
    )
    .orderBy(desc(productVariants.isDefault), asc(productVariants.title))
}

export async function listProductDetailMedia(
  productId: string,
): Promise<ProductDetailMediaRow[]> {
  return db
    .select({
      id: mediaAssets.id,
      key: mediaAssets.key,
      altText: mediaAssets.altText,
      variantId: productMedia.variantId,
      isPrimary: productMedia.isPrimary,
      sortOrder: productMedia.sortOrder,
    })
    .from(productMedia)
    .innerJoin(mediaAssets, eq(mediaAssets.id, productMedia.mediaAssetId))
    .where(eq(productMedia.productId, productId))
    .orderBy(desc(productMedia.isPrimary), asc(productMedia.sortOrder))
}

export async function listProductDetailAttributes(
  productId: string,
): Promise<ProductDetailAttributeRow[]> {
  return db
    .select({
      id: productAttributes.id,
      name: productAttributes.name,
      value: productAttributes.value,
      sortOrder: productAttributes.sortOrder,
    })
    .from(productAttributes)
    .where(eq(productAttributes.productId, productId))
    .orderBy(asc(productAttributes.sortOrder), asc(productAttributes.name))
}
