const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: true,
  env: {
    BUILD_ID: process.env.BUILD_ID,
    BUILD_TOKEN:process.env.BUILD_TOKEN
  }
}
