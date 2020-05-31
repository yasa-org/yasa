const path = require('path')

module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/': {
        target: 'http://127.0.0.1:8983',
        secure: false
      }
    }
  },
  configureWebpack: config => {
    config.plugins.forEach((item, i) => {
      if (item.tsconfig) {
        config.plugins.splice(i, 1)
      }
    })
    return {
      resolve: {
        alias: {
          '@': path.join(__dirname, 'src'),
          '@store': path.join(__dirname, 'src/store'),
          '@assets': path.join(__dirname, 'src/assets')
        }
      }
    }
  }
}
