import http from '@/api/http'


function getArticleCatalog(data) {
    return http.post('/api/articleCatalog', data)
}

function getArticleContent(data) {
    return http.post('/api/articleContent', data)
}



export default {
    getArticleCatalog,
    getArticleContent
}