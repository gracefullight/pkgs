import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/workspace/saju-example" : "",
  assetPrefix: isProd ? "/workspace/saju-example/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
