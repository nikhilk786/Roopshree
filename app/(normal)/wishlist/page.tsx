"use client"

import Image from "next/image"
import Link from "next/link"

import { formatPrice } from "@/components/global/const"
import { useWishlistStore } from "@/store/wishlistStore"

const Page = () => {
  const wishlistItems = useWishlistStore((state) => state.items)

  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-20">
      <section className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-black">
          Wishlist
        </h1>

        <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {wishlistItems.map((item) => (
            <Link
              key={item.productId}
              href="/product/traditional-bandhej-saree"
              className="block"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#f7eadb]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              <h2 className="mt-4 font-heading text-base leading-snug text-[#3f2617]">
                {item.title}
              </h2>
              <p className="mt-1 text-base font-medium text-[#c39150]">
                {formatPrice(item.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Page
