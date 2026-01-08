import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? "/saju" : "",
  assetPrefix: isProd ? "/saju/" : "",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default withNextIntl(nextConfig);
