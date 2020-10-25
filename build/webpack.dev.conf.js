'use strict'
const baseWebpackConfig = require('./webpack.base.conf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')



module.exports = merge(baseWebpackConfig, {
  entry: './src/entry-client.js',
  devServer: {
    host: '0.0.0.0',
    historyApiFallback: {
      rewrites: [{
        from: /.*/g,
        to: '/index.html'
      }]
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      VUE_ENV: '"development"',
    }),
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({ template: 'index.template.dev.html', filename: 'index.html', hash: false, })
  ]
})



