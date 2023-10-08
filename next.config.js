const path = require('path')
const removeImports = require("next-remove-imports");

module.exports = removeImports()({
  // ✅  options...
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader"
    });
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  trailingSlash: true,
  env: {
    BUILD_ID: process.env.BUILD_ID,
    BUILD_TOKEN:process.env.BUILD_TOKEN
  }
});