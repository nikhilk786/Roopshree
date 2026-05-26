/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import type { CartItem, CartItemInput } from "@/store/cartTypes"

type CartState = {
  items: CartItem[]
  setCart: (items: CartItem[]) => void
  addItem: (item: CartItemInput) => void
  removeItem: (productId: string, attributes?: CartItem["attributes"]) => void
  increase: (productId: string, attributes?: CartItem["attributes"]) => void
  decrease: (productId: string, attributes?: CartItem["attributes"]) => void
  clearCart: () => void
  lineItems: () => number
  totalItems: () => number
  subtotal: () => number
  getItemQuantity: (
    productId: string,
    attributes?: CartItem["attributes"]
  ) => number
}

function normalizeAttributes(attrs?: CartItem["attributes"]) {
  return (attrs ?? [])
    .slice()
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

function sameVariant(
  a: CartItem,
  b: { productId: string; attributes?: CartItem["attributes"] }
) {
  if (a.productId !== b.productId) return false

  const aAttrs = normalizeAttributes(a.attributes)
  const bAttrs = normalizeAttributes(b.attributes)

  return JSON.stringify(aAttrs) === JSON.stringify(bAttrs)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const safeItems = Array.isArray(state.items) ? state.items : []
          const existing = safeItems.find((i) => sameVariant(i, item))

          if (existing) {
            return {
              items: safeItems.map((i) =>
                sameVariant(i, item) ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }

          return {
            items: [...safeItems, { ...item, quantity: 1, addedAt: Date.now() }],
          }
        }),

      removeItem: (productId, attributes) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).filter(
            (i) => !sameVariant(i, { productId, attributes })
          ),
        })),

      increase: (productId, attributes) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).map((i) =>
            sameVariant(i, { productId, attributes })
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        })),

      decrease: (productId, attributes) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : [])
            .map((i) =>
              sameVariant(i, { productId, attributes })
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),

      clearCart: () => set({ items: [] }),

      setCart: (items) =>
        set(() => ({
          items: Array.isArray(items) ? items : [],
        })),

      lineItems: () => get().items.length,

      totalItems: () =>
        (Array.isArray(get().items) ? get().items : []).reduce(
          (total, item) => total + item.quantity,
          0
        ),

      subtotal: () =>
        (Array.isArray(get().items) ? get().items : []).reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      getItemQuantity: (productId, attributes) =>
        (Array.isArray(get().items) ? get().items : []).find((item) =>
          sameVariant(item, { productId, attributes })
        )?.quantity ?? 0,
    }),
    {
      name: "roopshree-cart",
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
