import { BlogDetailPage } from "@/components/blog/BlogDetailPage"
import { blogPosts, getBlogPost } from "@/components/global/const"

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPost(slug)

  return {
    title: post ? `${post.title} | Roop Shree` : "Blog | Roop Shree",
    description: post?.excerpt,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <BlogDetailPage slug={slug} />
}
