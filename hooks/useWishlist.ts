"use client"

import { useWishlistStore } from "@/store/wishlistStore"
import type { CartItemInput } from "@/store/cartTypes"

export function useWishlist() {
  const toggleItemOptimistic = useWishlistStore((state) => state.toggleItem)
  const addItem = useWishlistStore((state) => state.addItem)
  const removeItem = useWishlistStore((state) => state.removeItem)
  const setWishlist = useWishlistStore((state) => state.setWishlist)
  const hasItem = useWishlistStore((state) => state.hasItem)

  async function handleToggleWishlist(product: CartItemInput) {
    toggleItemOptimistic(product)

    // Backend sync placeholder:
    // try {
    //   const result = await toggleUserWishlistItem(product.productId)
    //
    //   if (result?.userIsNotLoggedIn) {
    //     toggleItemOptimistic(product)
    //     router.push("/auth")
    //     return
    //   }
    //
    //   if (!result?.success) {
    //     toggleItemOptimistic(product)
    //     return
    //   }
    //
    //   const updatedWishlist = await getUserWishlist()
    //   setWishlist(updatedWishlist)
    // } catch (error) {
    //   console.error(error)
    //   toggleItemOptimistic(product)
    // }

    void addItem
    void removeItem
    void setWishlist
  }

  return { handleToggleWishlist, hasItem }
}
