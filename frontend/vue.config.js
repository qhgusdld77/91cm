const path = require('path')

module.exports = {
  lintOnSave: false,
  // productionSourceMap: false,
  outputDir: path.resolve(__dirname, '../' + 'src/main/resources/static'),
  devServer: {
    https: true,
    proxy: {
      '/v1/translation/translate':{
        target: 'https://kapi.kakao.com',

        header: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      },
      '/api': {
        target: 'https://localhost:9191',
        // ws: false,
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      },
      '/oauth2':{
        target: 'https://localhost:9191',
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      },
      '/endpoint':{
        target: 'https://localhost:9191',
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      },
      '/login':{
        target: 'https://localhost:9191',
        changeOrigin: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        }
      }
    }
  },
  configureWebpack: {
    entry: ['babel-polyfill', './src/main.js']
  }
}
