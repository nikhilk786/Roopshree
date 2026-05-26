/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItemInput } from "@/store/cartTypes"

export type WishlistItem = CartItemInput & {
  addedAt: number
}

type WishlistState = {
  items: WishlistItem[]
  setWishlist: (items: WishlistItem[]) => void
  addItem: (item: CartItemInput) => void
  removeItem: (productId: string) => void
  toggleItem: (item: CartItemInput) => void
  hasItem: (productId: string) => boolean
  clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      setWishlist: (items) =>
        set({ items: Array.isArray(items) ? items : [] }),

      addItem: (item) =>
        set((state) => {
          const safeItems = Array.isArray(state.items) ? state.items : []

          if (safeItems.some((i) => i.productId === item.productId)) {
            return { items: safeItems }
          }

          return {
            items: [...safeItems, { ...item, addedAt: Date.now() }],
          }
        }),

      removeItem: (productId) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).filter(
            (item) => item.productId !== productId
          ),
        })),

      toggleItem: (item) => {
        if (get().hasItem(item.productId)) {
          get().removeItem(item.productId)
          return
        }

        get().addItem(item)
      },

      hasItem: (productId) =>
        (Array.isArray(get().items) ? get().items : []).some(
          (item) => item.productId === productId
        ),

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "roopshree-wishlist",
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState) => ({
        ...currentState,
        ...persistedState,
        items: Array.isArray(persistedState?.items)
          ? persistedState.items
          : [],
      }),
    }
  )
)
