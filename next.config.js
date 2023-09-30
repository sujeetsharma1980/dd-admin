const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: true,
  env: {
    AWS_BUILD_ID: process.env.AWS_BUILD_ID,
    AWS_BUILD_TOKEN:process.env.AWS_BUILD_TOKEN
  }
}
