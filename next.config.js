/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'chrome-aws-lambda']
  }
}

module.exports = nextConfig
