/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/dashboards",
        destination: "/modules/base/dashboards",
      },
      {
        source: "/orgs/:path*",
        destination: "/modules/base/orgs/:path*",
      },
      {
        source: "/representatives/:path*",
        destination: "/modules/base/representative/:path*",
      },
      {
        source: "/representatives",
        destination: "/modules/base/representative",
      },
      {
        source: "/orgs",
        destination: "/modules/base/orgs",
      },
      {
        source: "/campaigns/:path*",
        destination: "/modules/base/campaigns/:path*",
      },
      {
        source: "/campaigns",
        destination: "/modules/base/campaigns",
      },
      {
        source: "/donations/:path*",
        destination: "/modules/base/donations/:path*",
      },
      {
        source: "/donations",
        destination: "/modules/base/donations",
      },
      {
        source: "/settings/:path*",
        destination: "/modules/base/settings/:path*",
      },
      {
        source: "/settings",
        destination: "/modules/base/settings",
      },
    ];
  },
};

module.exports = nextConfig;
