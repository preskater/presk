import type { Metadata } from "next"

import { PageHeader } from "@/components/landing/page-header"
import { Section } from "@/components/landing/section"
import { BlogCard } from "@/components/landing/blog-card"
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty"

import { getAllPosts } from "@/lib/landing/blog"

export const metadata: Metadata = {
  title: "Blog",
  description: "Product updates, engineering notes and stories from the Presk team.",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="From the Presk team"
        description="Product updates, engineering deep-dives and ideas about how teams work."
      />
      <Section>
        {posts.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>No posts yet</EmptyTitle>
              <EmptyDescription>
                We&apos;re working on our first articles. Check back soon.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </Section>
    </>
  )
}
