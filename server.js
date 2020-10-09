/**
 * Created by yunrui001 on 2018-07-13.
 */
// express利用多核主机
const cluster = require('cluster');
//const http = require('http');
const numCPUs = require('os').cpus().length;

var express = require('express')
var bodyParser = require('body-parser')
//var serveStatic = require('serve-static')
var path = require('path')
var uuid = require('uuid')
// var app = express()
var connection = require('./src/mysql').pool
const templateHtml = require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require(`./dist/vue-ssr-server-bundle.json`)
const clientManifest = require(`./dist/vue-ssr-client-manifest.json`)

//==================log4js日志配置====================================================
const log4js = require('log4js');
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'log/cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'info' } }
});
const logger = log4js.getLogger('cheese');
//=====================================================================================

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐
  template: templateHtml,
  clientManifest // （可选）客户端构建 manifest
})

function renderToString(context) {
  return new Promise((resolve, reject) => {
    renderer.renderToString(context, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

// 日期原型对象拓展
Date.prototype.format = function (fmt) {
  var o = {
    'y+': this.getFullYear(),
    'M+': this.getMonth() + 1,                 // 月份
    'd+': this.getDate(),                    // 日
    'h+': this.getHours(),                   // 小时
    'm+': this.getMinutes(),                 // 分
    's+': this.getSeconds(),                 // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S+': this.getMilliseconds()             // 毫秒
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      if (k == 'y+') {
        fmt = fmt.replace(RegExp.$1, ('' + o[k]).substr(4 - RegExp.$1.length))
      } else if (k == 'S+') {
        var lens = RegExp.$1.length
        lens = lens == 1 ? 3 : lens
        fmt = fmt.replace(RegExp.$1, ('00' + o[k]).substr(('' + o[k]).length - 1, lens))
      } else {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
  }
  return fmt
}

if (false) {
  //if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  })

} else {
  var app = express()
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  /*静态资源缓存策略*/
  app.use(express.static(path.join(__dirname, 'dist'), {
    //cacheControl: false,
    //maxAge: '1y',
    //expires: '1y',
    Etag: false,
    lastModified: true
  }))
  app.use(express.static(path.join(__dirname, 'assets'), {
    //cacheControl: false,
    //maxAge: '1y',
    expires: '1y',
    Etag: false,
    lastModified: true
  }))

  //设置跨域访问
  /*app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    //res.header("X-Powered-By", ' 3.2.1')
    //res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });*/
  /*查询某类文章目录*/
  app.post('/api/articleCatalog', function (req, res, next) {
    let sql = `select * from articlecatalog where articleType='${req.body.articleType}'`

    connection.query({ sql }, function (err, result) {
      if (err) {
        console.log('error===========')
        logger.error(err.message)
        return;
      }
      //把搜索值输出
      //logger.info('getArticleList')
      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });//设置response编码为utf-8
      res.end(JSON.stringify(result));
    })
  })
  /*查询一篇文章*/
  app.post('/api/articleContent', function (req, res, next) {
    let sql = `select * from article where articleUrl='${req.body.articleUrl}'`

    connection.query({ sql }, function (err, result) {
      if (err) {
        console.log('error===========')
        logger.error(err.message)
        return;
      }
      //把搜索值输出
      //logger.info('getArticleList')
      if (result[0]) {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });//设置response编码为utf-8
        res.end(JSON.stringify(result[0]));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });//设置response编码为utf-8
        res.end(JSON.stringify({ articleContent: '没找到文章', title: '没找到文章' }));
        //res.end(JSON.stringify());
      }

    })
  })
  /*查询站点地图*/
  app.post('/api/sitemap', function (req, res, next) {
    let sql = 'select * from articlecatalog'
    connection.query({ sql }, function (err, result) {
      if (err) {
        console.log('error===========')
        logger.error(err.message)
        return;
      }
      //把搜索值输出
      //logger.info('getArticleList')
      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });//设置response编码为utf-8
      res.end(JSON.stringify(result));
    })
  })


  app.get('*', (req, res) => {
    const context = { url: req.url }
    renderToString(context).then(resopnse => {
      res.send(resopnse)
    }, error => {
      if (error.code == 404) {
        res.status(404)
        res.send('404')
      }
    })
  })

  app.listen(80)
}


