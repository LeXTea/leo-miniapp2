/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

// module.exports = nextConfig;
module.exports = {
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/01998356-d908-843e-bf0b-9153bae03cd1',
        permanent: false,
      },
    ]
  },
}