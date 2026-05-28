import {
  createProductRecord,
  findProductById,
  findProductDetailBySlug,
  listCategoryRows,
  listProductDetailAttributes,
  listProductDetailMedia,
  listProductDetailVariants,
  listProductRows,
  countProductRows,
  updateProductRecord,
  type ProductListQuery,
  type ProductListRow,
} from '@/repositories/product.repository'
import { getS3ObjectPreviewUrl } from '@/lib/s3'
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

function mapProductRow(row: ProductListRow) {
  const image = row.imageKey ? getS3ObjectPreviewUrl(row.imageKey) : ''
  const price = (row.variantPrice ?? row.basePrice) / 100

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    colour: row.color ?? '',
    price,
    image,
    imageClass: 'object-top',
  }
}

export async function getCatalogProducts(query: ProductListQuery = {}) {
  const rows = await listProductRows(query)

  return rows.map(mapProductRow)
}

export async function getCatalogProductPage(query: ProductListQuery = {}) {
  const [items, total] = await Promise.all([
    getCatalogProducts(query),
    countProductRows(query),
  ])

  return {
    items,
    total,
  }
}

export async function getFeaturedProducts(limit = 5) {
  return getCatalogProducts({
    featured: true,
    limit,
    sortBy: 'featured',
  })
}

export async function getRecommendedProducts(limit = 5) {
  return getCatalogProducts({
    limit,
    sortBy: 'newest',
  })
}

export async function getCatalogCategories(limit = 8) {
  const rows = await listCategoryRows(limit)

  return rows.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    href: `/shop?category=${category.slug}`,
    image: category.imageKey ? getS3ObjectPreviewUrl(category.imageKey) : '',
  }))
}

export async function getProductDetailsBySlug(slug: string) {
  const product = await findProductDetailBySlug(slug)

  if (!product) {
    return null
  }

  const [variants, media, attributes] = await Promise.all([
    listProductDetailVariants(product.id),
    listProductDetailMedia(product.id),
    listProductDetailAttributes(product.id),
  ])

  const defaultVariant = variants.find((variant) => variant.isDefault) ?? variants[0]
  const price = (defaultVariant?.price ?? product.basePrice) / 100
  const strikeThroughPrice =
    (defaultVariant?.strikeThroughPrice ?? product.strikeThroughPrice ?? 0) / 100

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: defaultVariant?.sku ?? product.sku,
    description: product.description ?? product.shortDescription ?? '',
    price,
    strikeThroughPrice: strikeThroughPrice || null,
    variants: variants.map((variant) => ({
      id: variant.id,
      title: variant.title,
      sku: variant.sku,
      price: variant.price / 100,
      strikeThroughPrice: variant.strikeThroughPrice
        ? variant.strikeThroughPrice / 100
        : null,
      stockQuantity: variant.stockQuantity,
      color: variant.color ?? variant.title,
      fabric: variant.fabric,
      size: variant.size,
      isDefault: variant.isDefault,
      image: (() => {
        const imageKey =
          media.find((item) => item.variantId === variant.id)?.key ??
          media.find((item) => item.isPrimary)?.key ??
          media[0]?.key

        return imageKey ? getS3ObjectPreviewUrl(imageKey) : ''
      })(),
    })),
    media: media.map((item) => ({
      id: item.id,
      src: getS3ObjectPreviewUrl(item.key),
      alt: item.altText ?? product.name,
      variantId: item.variantId,
      isPrimary: item.isPrimary,
    })),
    attributes: attributes.map((attribute) => ({
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
    })),
  }
}
