/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['puppeteer', 'chrome-aws-lambda']
  }
}

module.exports = nextConfig
