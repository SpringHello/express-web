# Vue服务端渲染项目搭建

你是否有过这样的苦恼。想搭建vue服务端渲染项目，却看不太明白官网提供的[vue ssr指南](https://ssr.vuejs.org/zh/)。本文就介绍通过vue-cli工具生成的spa项目改造成vue ssr项目。也算是对vue ssr指南的详解（其实官网已经介绍的十分详细）

现提供通过本教程已经搭建好的vue ssr项目


## 写在前面
因为Vue服务端渲染搭建涉及到比较多的配置与代码，所以强烈建议大家下载已经搭建好的ssr项目并跑起来。结合着代码阅读本文能起到事半功倍的效果
## webpack相关配置
服务端渲染的流程（借用官网的一张图片）
![服务端渲染流程](/img/786a415a-5fee-11e6-9c11-45a2cfdf085c.png)
从这张图中我们可以看出。同一份代码通过过两个webpack入口，打包成两份 bundle（server-bundle在node中运行，生成html代码。client-bundle在浏览器中运行）。最后客户端和服务器端render的html代码混合（混合的意思是检测服务端渲染和客户端渲染出的结果是否一致。理论上两端渲染出来的代码是一致的。由于服务端渲染出来的只是html，混合的另一个功能是在相应的dom节点添加事件）

我们将webpack配置文件分为三块（webpack.base.conf.js、webpack.client.conf.js、webpack.server.conf.js）
- webpack.base.conf.js（webpack基础配置，其他两个webpack配置都引用了该文件）
- webpack.client.conf.js（webpack打包客户端文件使用的配置）
- webpack.server.conf.js（webpack打包服务端文件使用的配置）

```javascript
// webpack.base.conf.js
'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: resolve('dist')
  },
  externals: {},
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024 * 8, //8M以下使用base64
          name: 'img/[name].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          // name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          name: 'fonts/[name].[ext]'
        }
      }
    ]
  }
}

```
```javascript
//webpack.client.conf.js
'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  entry: './src/entry-client.js',
  plugins: [
    // 重要信息：这将 webpack 运行时分离到一个引导 chunk 中，
    // 以便可以在之后正确注入异步 chunk。
    // 这也为你的 应用程序/vendor 代码提供了更好的缓存。
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new webpack.DefinePlugin({
      VUE_ENV: 'client',
    }),
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})
```
```javascript
// webpack.server.conf.js
'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.conf.js')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  // 将 entry 指向应用程序的 server entry 文件
  entry: './src/entry-server.js',
  // 这允许 webpack 以 Node 适用方式(Node-appropriate fashion)处理动态导入(dynamic import)，
  // 并且还会在编译 Vue 组件时，
  // 告知 `vue-loader` 输送面向服务器代码(server-oriented code)。
  target: 'node',
  // 对 bundle renderer 提供 source map 支持
  devtool: 'source-map',
  // 此处告知 server bundle 使用 Node 风格导出模块(Node-style exports)
  output: {
    libraryTarget: 'commonjs2',
  },
  // https://webpack.js.org/configuration/externals/#function
  // https://github.com/liady/webpack-node-externals
  // 外置化应用程序依赖模块。可以使服务器构建速度更快，
  // 并生成较小的 bundle 文件。
  externals: nodeExternals({
    // 不要外置化 webpack 需要处理的依赖模块。
    // 你可以在这里添加更多的文件类型。例如，未处理 *.vue 原始文件，
    // 你还应该将修改 `global`（例如 polyfill）的依赖模块列入白名单
    whitelist: /\.css$/
  }),
  // 这是将服务器的整个输出
  // 构建为单个 JSON 文件的插件。
  // 默认文件名为 `vue-ssr-server-bundle.json`
  plugins: [
    new webpack.DefinePlugin({
      VUE_ENV: 'server',
    }),
    new VueSSRServerPlugin()
  ]
})
```
## webpack入口文件
webpack入口文件同样分为server端、client端。因为代码中有大量注释，这里就不再详细解释webpack入口文件
```javascript
// entry-client.js
import createApp from './createApp'
import 'promise-polyfill/src/polyfill'
var {app, router, store} = createApp()

// 客户端渲染不用发送ajax请求页面数据
// 服务端会把页面数据设置到window对象的__INITIAL_STATE__变量中
// 直接使用vuex store对象的replaceState获取数据
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)

    // 我们只关心非预渲染的组件
    // 所以我们对比它们，找出两个匹配列表的差异组件
    let diffed = false
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })

    if (!activated.length) {
      return next()
    }

    // 这里如果有加载指示器(loading indicator)，就触发
    Promise.all(activated.map(c => {
      // 服务端只会设置首页数据到__INITIAL_STATE__
      // 所以页面切换时会调用异步加载数据。
      if (c.asyncData) {
        return c.asyncData({store, route: to})
      }
    })).then(() => {
      next()
    }).catch(next)
  })
  app.$mount('#app')
})
```
```javascript
// entry-server.js
import createApp from './createApp'

export default context => {
  // 因为有可能会是异步路由钩子函数或组件，所以我们将返回一个 Promise，
  // 以便服务器能够等待所有的内容在渲染前，
  // 就已经准备就绪。
  return new Promise((resolve, reject) => {
    const {app, router, store} = createApp()

    // 设置服务器端 router 的位置
    router.push(context.url)

    // 等到 router 将可能的异步组件和钩子函数解析完
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行 reject 函数，并返回 404
      if (!matchedComponents.length) {
        return reject({code: 404})
      }

      Promise.all(matchedComponents.map(Component => {
        if (Component.asyncData) {
          return Component.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        // 在所有预取钩子(preFetch hook) resolve 后，
        // 我们的 store 现在已经填充入渲染应用程序所需的状态。
        // 当我们将状态附加到上下文，
        // 并且 `template` 选项用于 renderer 时，
        // 状态将自动序列化为 `window.__INITIAL_STATE__`，并注入 HTML。
        context.state = store.state

        resolve(app)
      }).catch(reject)

      // Promise 应该 resolve 应用程序实例，以便它可以渲染
      //resolve(app)
    }, reject)
  })
}
```
在entry-client.js、entry-server.js中，我们都引入了一个createApp.js文件。我们先看看这个文件的源码。
```javascript
// createApp.js
import Vue from 'vue'
import Main from './Main'
import createRouter from './router'
import createStore from './vuex'

export default function createApp() {
  const router = createRouter()
  const store = createStore()
  const app = new Vue({
    router,
    store,
    render: h => h(Main)
  })
  return {app, router, store}
}
```
createApp.js返回的是一个包含Vue、router、store（全家桶）的对象，回想一下在vue-spa项目的时候都是直接new一个Vue实例对象并挂载到一个dom节点。这里为什么要返回一个方法来生产vue、router、store呢

这里我们直接贴上vue ssr指南的官方解释**避免状态单例**
>当编写纯客户端(client-only)代码时，我们习惯于每次在新的上下文中对代码进行取值。但是，Node.js 服务器是一个长期运行的进程。当我们的代码进入该进程时，它将进行一次取值并留存在内存中。这意味着如果创建一个单例对象，它将在每个传入的请求之间共享。
如基本示例所示，我们**为每个请求创建一个新的根 Vue 实例**。这与每个用户在自己的浏览器中使用新应用程序的实例类似。如果我们在多个请求之间使用一个共享的实例，很容易导致交叉请求状态污染(cross-request state pollution)。
因此，我们不应该直接创建一个应用程序实例，而是应该暴露一个可以重复执行的工厂函数，为每个请求创建新的应用程序实例： 
## vuex与vue-router
vuex&vue-router的配置与vue spa项目一致。为了**避免状态单例**，同样返回的是function
```javascript
// vuex/index.js
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000/'
Vue.use(Vuex)

export default function createStore() {
  return new Vuex.Store({
    state: {
      demoData: {},
    },
    actions: {
      // home页面demo数据
      demoData({commit}){
        // 会向Express发送请求
        return axios.get('api/getDemoData').then(response => {
          // 请求数据设置到state中
          if (response.status == 200) {
            commit('setDemoData', response.data)
          }
        }, response => {
          // 异常情况处理
          console.log(response)
        })
      },
    },
    mutations: {
      setDemoData (state, demoData) {
        state.demoData = demoData
      },
    }
  })
}
```
```javascript
// router/index.js
import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'

Vue.use(Router)

export default function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
	  // 暂时只有一个路由。大家可以自行添加
      {
        path: '/home',
        name: Home.name,
        component: Home,
      }
    ]
  })
}
```

## Express相关
本例我们使用Express作为web应用框架，Express主要处理静态资源、ajax请求、页面请求
```javascript
// server.js
var express = require('express')
var bodyParser = require('body-parser')
//var serveStatic = require('serve-static')
var path = require('path')

// Express
var app = express()

// 这里可以使用mysql作为数据库
// var connection = require('./src/mysql').connection

// vue服务端渲染模版页面
const templateHtml = require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')

const {createBundleRenderer} = require('vue-server-renderer')
// 引用打包好的服务端json文件
const serverBundle = require(`./dist/vue-ssr-server-bundle.json`)
const clientManifest = require(`./dist/vue-ssr-client-manifest.json`)

//==================log4js日志配置====================================================
const log4js = require('log4js');
log4js.configure({
  appenders: {cheese: {type: 'file', filename: 'log/cheese.log'}},
  categories: {default: {appenders: ['cheese'], level: 'info'}}
});
const logger = log4js.getLogger('cheese');
//=====================================================================================

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template: templateHtml,
  clientManifest // （可选）客户端构建 manifest
})

// 服务端渲染为string
function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/*静态资源缓存策略*/
app.use(express.static(path.join(__dirname, 'dist'), {
  Etag: false,
  lastModified: true
}))

/*dome数据接口*/
app.get('/api/getDemoData', (req, res, next) => {
  // 这是demo接口返回数据
  // 这里也可以改写为从数据库查询获取
  var result = {
    title: '我是demo数据的标题',
    desc: '我是demo数据的描述',
    content: '我是demo数据的正文'
  }
  res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});//设置response编码为utf-8
  res.end(JSON.stringify(result));
})

// 因为使用的是vue-router
// 所以所有页面请求都捕获，交由vue-router实现路由
app.get('*', (req, res) => {
  const context = {url: req.url}
  renderToString(context).then(resopnse => {
    res.send(resopnse)
  }, error => {
    console.log(error)
    if (error.code == 404) {
      res.status(404)
      res.send('404')
    }
  })
})

app.listen(3000)
```

## 服务端渲染测试
最后我们执行 **npm run build**
![vue ssr打包完成截图](/img/menu.saveimg.savepath20180929161651.jpg)
启动Express执行 **node server.js**，打开浏览器访问 localhost:3000
![vue ssr运行截图](/img/menu.saveimg.savepath20180929164428.jpg)
在chrome浏览器下，可以看到Preview与我们页面一致，证明服务端渲染已经成功了。
本教程的完整源码托管与github。欢迎大家star
