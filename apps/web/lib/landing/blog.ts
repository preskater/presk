import fs from "node:fs"
import path from "node:path"

export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tag: string
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string
}

const blogDir = path.join(process.cwd(), "content", "blog")

function parseFrontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match || !match[1]) return {}
  const block = match[1]
  const result: Record<string, string> = {}
  for (const line of block.split(/\r?\n/)) {
    const separator = line.indexOf(":")
    if (separator === -1) continue
    const key = line.slice(0, separator).trim()
    const raw = line.slice(separator + 1).trim()
    result[key] = raw.replace(/^["']|["']$/g, "")
  }
  return result
}

export function getBlogSlugs(): string[] {
  if (!fs.existsSync(blogDir)) return []
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""))
}

export function getPost(slug: string): BlogPostMeta | undefined {
  const filePath = path.join(blogDir, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return undefined
  const source = fs.readFileSync(filePath, "utf8")
  const data = parseFrontmatter(source)
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "Presk",
    tag: data.tag ?? "Product",
  }
}

export function getAllPosts(): BlogPostMeta[] {
  return getBlogSlugs()
    .map((slug) => getPost(slug))
    .filter((post): post is BlogPostMeta => post !== undefined)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function formatPostDate(value: string) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
