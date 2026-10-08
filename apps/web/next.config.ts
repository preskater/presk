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
