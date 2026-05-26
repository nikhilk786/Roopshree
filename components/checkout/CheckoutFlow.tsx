"use client"

import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { CheckoutReviewModal } from "@/components/checkout/CheckoutReviewModal"
import { CheckoutSummary } from "@/components/checkout/CheckoutSummary"
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps"
import { getCartSummary } from "@/components/global/const"
import { useCartStore } from "@/store/cartStore"

export function CheckoutFlow() {
  const items = useCartStore((state) => state.items)
  const summary = getCartSummary(items)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isReviewOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isReviewOpen])

  return (
    <>
      <CheckoutSteps activeStep={1} />

      <div className="mt-8 grid gap-5 md:mt-12 md:grid-cols-[480px_210px] md:items-start md:justify-center">
        <section className="min-w-0">
          <h1 className="font-heading text-xl font-semibold leading-none text-black">
            Shipping Details
          </h1>
          <form className="mt-5 grid gap-3 md:mt-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <CheckoutInput label="Full Name" />
              <CheckoutInput label="Phone no." />
            </div>
            <CheckoutInput label="Address Line 1" />
            <CheckoutInput label="Address Line 2 (Optional)" />
            <div className="grid gap-3 sm:grid-cols-2">
              <CheckoutInput label="City" />
              <CheckoutInput label="State" />
            </div>
            <CheckoutInput label="Pincode" />
            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              disabled={items.length === 0}
              className="mt-2 h-11 bg-[#C39150] px-6 text-sm font-semibold tracking-[0.05em] text-white transition hover:bg-[#3F2617] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Review Order
            </button>
          </form>
        </section>

        <CheckoutSummary items={items} summary={summary} />
      </div>

      {typeof document !== "undefined" && isReviewOpen
        ? createPortal(
            <CheckoutReviewModal
              items={items}
              summary={summary}
              onClose={() => setIsReviewOpen(false)}
            />,
            document.body
          )
        : null}
    </>
  )
}

function CheckoutInput({ label }: { label: string }) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type="text"
        placeholder={label}
        className="h-11 w-full border border-[#C39150]/80 bg-white/70 px-4 text-sm font-medium text-[#3F2617] outline-none transition placeholder:text-[#3F2617]/70 focus:border-[#3F2617] md:h-10 md:text-xs"
      />
    </label>
  )
}
