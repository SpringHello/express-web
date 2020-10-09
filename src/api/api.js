import http from '@/api/http'

//获取专栏目录
function getArticleCatalog(data) {
    return http.post('/api/articleCatalog', data)
}
//获取某一篇文章正文
function getArticleContent(data) {
    return http.post('/api/articleContent', data)
}

//获取站点地图数据
function getSitemap(data) {
    return http.post('/api/sitemap', data)
}


export default {
    getArticleCatalog,
    getArticleContent,
    getSitemap
}