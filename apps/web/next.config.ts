import path from "node:path"
import { fileURLToPath } from "node:url"

import type { NextConfig } from "next"

const projectRoot = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(projectRoot, "../../"),
  transpilePackages: ["@workspace/ui"],
}

export default nextConfig
