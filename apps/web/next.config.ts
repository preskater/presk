import path from "node:path"
import { fileURLToPath } from "node:url"

import createMDX from "@next/mdx"
import createNextIntlPlugin from "next-intl/plugin"

import type { NextConfig } from "next"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(projectRoot, "../../"),
  transpilePackages: ["@workspace/ui"],
  // `pg-large-object` is CommonJS with native `pg` bindings; keep it external
  // so the server bundle loads it at runtime instead of trying to bundle it.
  serverExternalPackages: ["pg-large-object", "pg"],
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    globalNotFound: true,
  },
}

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
    ],
  },
})

const withNextIntl = createNextIntlPlugin()

export default withNextIntl(withMDX(nextConfig))
