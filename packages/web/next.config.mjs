const nextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  transpilePackages: ["packages/*", "@t3-oss/env-nextjs"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Wildcard to allow all hostnames (domains)
      },
    ],
  },
}

export default nextConfig
