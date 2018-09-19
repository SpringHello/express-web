/**
 * Created by yunrui001 on 2018-07-13.
 */
var express = require('express')
var bodyParser = require('body-parser')
//var serveStatic = require('serve-static')
var path = require('path')
var uuid = require('uuid')
var app = express()
var connection = require('./src/mysql').connection
const templateHtml = require('fs').readFileSync(path.resolve(__dirname, './index.template.html'), 'utf-8')
const {createBundleRenderer} = require('vue-server-renderer')
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

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

/*静态资源缓存策略*/
app.use('/public', express.static(path.join(__dirname, 'dist'), {
  //cacheControl: 'no-cache',
  maxAge: '1y',
  expires: '1y',
  Etag: false,
  lastModified: false
}))
app.use('/public', express.static(path.join(__dirname, 'assets'), {
  //cacheControl: 'no-cache',
  maxAge: '1y',
  expires: '1y',
  Etag: false,
  lastModified: false
}))
function setCustomCacheControl(res, path) {
  /*if (serveStatic.mime.lookup(path) === 'text/html') {
   // Custom Cache-Control for HTML files
   res.setHeader('Cache-Control', 'public, max-age=0')
   }*/
}

/*查询文章列表*/
app.get('/api/getArticleList/:type', (req, res, next) => {
  let sql = `select *,UNIX_TIMESTAMP(createTime) as createTime from Article where artType='${req.params.type}'`
  connection.query(sql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
    //把搜索值输出
    logger.info('getArticleList')
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify(result));
  })
})

/*查询具体文章*/
app.get('/api/getArt/:aid', (req, res, next) => {
  let sql = `select * from Content where aid = '${req.params.aid}'`
  let updateSql = `update article set article.read = article.read + 1 where aid = '${req.params.aid}'`
  connection.query(sql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
    //把搜索值输出
    logger.info(`getArt==>${req.params.aid}`)
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify(result[0]));
  })
  connection.query(updateSql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
  })
})

/*查询文章评论*/
app.get('/api/getArtComment/:aid', (req, res, next) => {
  let sql = `select cid,pid,aid,user,content,DATE_FORMAT(createTime,'%Y-%m-%d %H:%i') as time from Comment where aid = '${req.params.aid}' order by createTime`
  connection.query(sql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
    //获取文章评论不打印日志
    //logger.info(`getArt==>${req.params.aid}`)
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify(result));
  })
})

/*插入文章评论*/
app.post('/api/publish', (req, res, next) => {
  var cid = uuid.v4()
  var dateTime = new Date().format('yyyy-MM-dd hh:mm:ss')
  var sql = `insert into Comment values('${cid}','${req.body.pid}','${req.body.aid}','${req.body.userName}','${dateTime}','${req.body.content}')`
  connection.query(sql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
    //获取文章评论不打印日志
    //logger.info(`getArt==>${req.params.aid}`)
    res.writeHead(200, {'Content-Type': 'application/json;charset=utf-8'});//设置response编码为utf-8
    res.end(JSON.stringify({
      aid: req.body.aid,
      cid: cid,
      content: req.body.content,
      pid: req.body.pid,
      time: dateTime,
      user: req.body.userName
    }));
  })
})

app.get('*', (req, res) => {
  const context = {url: req.url}
  renderToString(context).then(resopnse => {
    res.send(resopnse)
  }, error => {
    console.log(error)
  })
})

app.listen(3000)
