/**
 * Created by yunrui001 on 2018-07-13.
 */
var express = require('express')
var path = require('path')
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

app.use('/', express.static('./dist'))
app.use('/', express.static('./assets'))

app.get('/api/getArticleList/:type', (req, res, next) => {
  let sql = `select *,UNIX_TIMESTAMP(createTime) as createTime from Article where artType='${req.params.type}'`
  connection.query(sql, function (err, result) {
    if (err) {
      logger.error(err.message)
      return;
    }
    //把搜索值输出
    logger.info('getArticleList')
    res.end(JSON.stringify(result));
  })
})

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
      res.end(JSON.stringify(result[0]));
    })
    connection.query(updateSql, function (err, result) {
      if (err) {
        logger.error(err.message)
        return;
      }
    })
  }
)

app.get('*', (req, res) => {
  const context = {url: req.url}
  renderToString(context).then(resopnse => {
    res.send(resopnse)
  }, error => {
    console.log(error)
  })
})

app.listen(3000)
