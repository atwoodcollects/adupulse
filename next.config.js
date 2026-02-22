/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/scores', destination: '/rankings', permanent: true },
      { source: '/scorecards', destination: '/rankings', permanent: true },
      { source: '/leaderboard', destination: '/rankings', permanent: true },
      { source: '/club', destination: '/', permanent: true },
    ]
  },
}
module.exports = nextConfig
