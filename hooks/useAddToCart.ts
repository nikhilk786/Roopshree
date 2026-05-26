"use client"

import { useCartStore } from "@/store/cartStore"
import type { CartItemInput } from "@/store/cartTypes"

export function useAddToCart() {
  const addItemOptimistic = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const setCart = useCartStore((state) => state.setCart)

  async function handleAddToCart(product: CartItemInput) {
    addItemOptimistic(product)

    // Backend sync placeholder:
    // try {
    //   const result = await addProductToUserCart(product.productId, 1)
    //
    //   if (result?.userIsNotLoggedIn) {
    //     removeItem(product.productId, product.attributes)
    //     router.push("/auth")
    //     return
    //   }
    //
    //   if (!result?.success) {
    //     removeItem(product.productId, product.attributes)
    //     return
    //   }
    //
    //   const updatedCart = await getUserCart()
    //   setCart(updatedCart)
    // } catch (error) {
    //   console.error(error)
    //   removeItem(product.productId, product.attributes)
    // }

    void removeItem
    void setCart
  }

  return { handleAddToCart }
}
