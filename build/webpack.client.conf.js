'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
  entry: {
    app: './src/entry-client.js',
    vender: ['vue'],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: "vender",
      fileName: '[name].js'
    }),
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {     //压缩代码
        dead_code: true,    //移除没被引用的代码
        warnings: false,     //当删除没有用处的代码时，显示警告
        loops: true //当do、while 、 for循环的判断条件可以确定是，对其进行优化
      },
      except: ['exports', 'require']    //混淆,并排除关键字
    }),
    new webpack.DefinePlugin({
      VUE_ENV: '"client"',
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin(),
  ]
})



