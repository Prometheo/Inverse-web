const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
  switch (phase) {
    case PHASE_DEVELOPMENT_SERVER:
      return {
        env: {
          API_URL: 'http://localhost:3000/api',
          COINGECKO_PRICE_API: 'https://api.coingecko.com/api/v3/simple/price',
        },
      }
    default:
      return {
        typescript: {
          ignoreBuildErrors: true,
        },
        env: {
          API_URL: 'https://inverse-web.vercel.app/api',
          COINGECKO_PRICE_API: 'https://api.coingecko.com/api/v3/simple/price',
        },
      }
  }
}