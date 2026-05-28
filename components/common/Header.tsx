"use client"

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { createPortal } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"



const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Blogs", href: "/blogs" },
]

const Header = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  )
  const clearCart = useCartStore((state) => state.clearCart)
  const wishlistCount = useWishlistStore((state) => state.items.length)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 12)

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""

    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (isAuthenticated) return

    clearCart()
    clearWishlist()
  }, [clearCart, clearWishlist, isAuthenticated])

  const mobileMenu = (
    <AnimatePresence>
      {isMenuOpen ? (
        <>
          <motion.button
            aria-label="Close menu"
            className="fixed inset-0 md:hidden"
            style={{
              zIndex: 9998,
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              backdropFilter: "blur(2px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
          <motion.aside
            className="fixed inset-y-0 left-0 flex w-80 max-w-[84vw] flex-col px-7 py-5 shadow-2xl md:hidden"
            style={{ zIndex: 9999, backgroundColor: "#ffffff" }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
          >
            <div className="mb-10 flex items-center justify-between">
              <Link
                href="/"
                className="relative block h-12 w-20"
                onClick={() => setIsMenuOpen(false)}
              >
                <Image
                  src="/header-logo.png"
                  alt="Roop Shree"
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </Link>
              <Button
                aria-label="Close menu"
                size="icon-sm"
                variant="ghost"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>

            <nav className="flex flex-col gap-5 text-xl font-medium text-[#3F2617]">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="transition-colors hover:text-[#C39150]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {isAuthenticated ? (
              <Button
                asChild
                className="mt-auto h-12 rounded-[4px] bg-[#C39150] text-base text-white hover:bg-[#3F2617]"
              >
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Account
                </Link>
              </Button>
            ) : (
              <div className="mt-auto grid gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-[4px] border-[#C39150] text-base text-[#C39150]"
                >
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-12 rounded-[4px] bg-[#C39150] text-base text-white hover:bg-[#3F2617]"
                >
                  <Link href="/auth?view=signup" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  )

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${
        isMenuOpen ? "z-[9997]" : "z-50"
      } ${
        hasScrolled || isMenuOpen
          ? "border-b border-[#C39150]/25 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 md:flex md:justify-between lg:px-8">
        <div className="flex items-center gap-2 justify-self-start md:hidden">
          <Button
            aria-label="Open menu"
            size="icon-sm"
            variant="ghost"
            onClick={() => setIsMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <Button aria-label="Search" size="icon-sm" variant="ghost">
            <Search className="size-4" />
          </Button>
        </div>

        <Link href="/" className="relative block h-11 w-20 shrink-0 justify-self-center md:justify-self-auto">
          <Image
            src="/header-logo.png"
            alt="Roop Shree"
            fill
            priority
            sizes="80px"
            className="object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-9 text-sm font-medium text-[#3F2617] md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative pb-2 transition-colors duration-300 ${
                  isActive
                    ? "text-[#3F2617]"
                    : "text-[#3F2617] hover:text-[#C39150]"
                }`}
              >
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-[#C39150] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0"
                  }`}
                />

                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-2 justify-self-end">
          <label className="hidden h-9 w-56 items-center gap-2 rounded-full border border-[#3F2617] bg-white/60 px-4 text-xs text-[#3F2617] lg:flex">
            <input
              type="search"
              placeholder="Search for sarees..."
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#3F2617]"
            />
            <Search className="size-4" />
          </label>

          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button aria-label="Account" size="icon-sm" variant="ghost">
                <User size={20} />
              </Button>
            </Link>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-[#3F2617] hover:text-[#C39150]"
              >
                <Link href="/auth">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="rounded-[4px] bg-[#C39150] px-3 text-white hover:bg-[#3F2617]"
              >
                <Link href="/auth?view=signup">Sign Up</Link>
              </Button>
            </div>
          )}

          <Link href="/cart">
            <Button
              aria-label={`Cart, ${cartCount} items`}
              size="icon-sm"
              variant="ghost"
              className="relative"
            >
              <ShoppingBag className="size-4" />
              {cartCount > 0 ? <NavBadge count={cartCount} /> : null}
            </Button>
          </Link>
          <Link href="/wishlist">
            <Button
              aria-label={`Wishlist, ${wishlistCount} items`}
              size="icon-sm"
              variant="ghost"
              className="relative"
            >
              <Heart className="size-4" />
              {wishlistCount > 0 ? <NavBadge count={wishlistCount} /> : null}
            </Button>
          </Link>
        </div>
      </div>
    </header>
    {typeof document !== "undefined"
      ? createPortal(mobileMenu, document.body)
      : null}
    </>
  )
}

function NavBadge({ count }: { count: number }) {
  return (
    <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[#C39150] px-1 text-[10px] font-semibold leading-4 text-white">
      {count > 99 ? "99+" : count}
    </span>
  )
}

export default Header
