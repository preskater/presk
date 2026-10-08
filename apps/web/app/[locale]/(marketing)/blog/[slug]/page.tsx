import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { Container } from "@/components/landing/section"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"

import {
  formatPostDate,
  getPost,
  getBlogSlugs,
  type BlogFrontmatter,
} from "@/lib/landing/blog"

type PostModule = {
  default: React.ComponentType
  frontmatter?: BlogFrontmatter
}

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const { default: Post } = (await import(
    `@/content/blog/${slug}.mdx`
  )) as PostModule

  return (
    <>
      <section className="border-b bg-muted/30 py-14 sm:py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeftIcon className="size-3.5" />
              All posts
            </Link>
            <div className="mt-6 flex items-center gap-3">
              <Badge variant="secondary">{post.tag}</Badge>
              <span className="text-sm text-muted-foreground">
                {formatPostDate(post.date)}
              </span>
            </div>
            <h1 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground text-pretty">
              {post.description}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              By {post.author}
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <article className="mx-auto max-w-3xl">
          <Post />
          <Separator className="my-12" />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            <ArrowLeftIcon className="size-4" />
            Back to all posts
          </Link>
        </article>
      </Container>
    </>
  )
}
