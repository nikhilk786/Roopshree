import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Search, UserRound } from "lucide-react"

import { blogCategories, blogPosts } from "@/components/global/const"

export function BlogListingPage() {
  return (
    <main className="flex-1 bg-white pt-16">
      <BlogHero />
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-12 lg:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-3">
            {blogCategories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`h-8 rounded-full border px-6 text-xs font-semibold transition ${
                  index === 0
                    ? "border-[#C39150] bg-[#C39150] text-white"
                    : "border-transparent text-[#3F2617] hover:border-[#C39150]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <label className="flex h-9 w-full items-center gap-2 rounded-full border border-[#3F2617]/45 bg-white px-4 text-xs text-[#3F2617] sm:w-72">
            <input
              type="search"
              placeholder="Search blog / journals"
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#3F2617]/70"
            />
            <Search className="size-4" />
          </label>
        </div>

        <div className="mt-8 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {blogPosts.map((post, index) => (
            <BlogCard key={`${post.title}-${index}`} post={post} />
          ))}
        </div>
      </section>
    </main>
  )
}

function BlogHero() {
  return (
    <section className="relative isolate min-h-[460px] overflow-hidden md:min-h-[520px]">
      <Image
        src="/blog/blog-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover object-center"
      />
      <div className="mx-auto flex min-h-[460px] max-w-7xl items-center px-5 py-14 sm:px-6 md:min-h-[520px] lg:px-8">
        <div className="max-w-xl text-[#3F2617]">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#C39150]">
            Blogs / Journal
          </p>
          <h1 className="mt-4 font-heading text-[3rem] leading-[0.95] text-[#3F2617] sm:text-6xl md:text-7xl">
            Stories Woven
            <span className="block italic text-[#C39150]">In Tradition</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-6 text-[#3F2617]/75">
            Discover the timeless beauty of Bandhej through our carefully
            curated stories, style inspiration, and cultural insights.
          </p>
          <p className="mt-5 max-w-lg text-sm leading-6 text-[#3F2617]/75">
            From traditional craftsmanship and heritage-rich techniques to
            modern styling tips, care guides, and behind-the-scenes moments,
            explore the journey of authentic Bandhej and the spirit of
            Rajasthan.
          </p>
        </div>
      </div>
    </section>
  )
}

export function BlogCard({ post }: { post: (typeof blogPosts)[number] }) {
  return (
    <article className="group min-w-0">
      <Link href={`/blogs/${post.slug}`} className="block">
        <div className="relative aspect-[0.82] overflow-hidden bg-[#f7eadb]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top transition duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <h2 className="mt-4 font-heading text-sm font-semibold leading-snug text-[#3F2617]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#3F2617]/70">
          {post.excerpt}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#3F2617]/75">
          <span className="inline-flex items-center gap-1.5">
            <UserRound className="size-3.5 text-[#C39150]" />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-[#C39150]" />
            {post.date}
          </span>
        </div>
        <p className="mt-1 text-[11px] text-[#3F2617]/55">{post.readTime}</p>
      </Link>
    </article>
  )
}
