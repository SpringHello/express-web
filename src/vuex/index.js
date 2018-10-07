/**
 * Created by yunrui001 on 2018-07-14.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../util/http'
import timeago from 'timeago.js'

Vue.use(Vuex)

export default function createStore() {
  return new Vuex.Store({
    state: {
      // home页面javascript页面
      articleResult: {},
      // 文章详情页面
      art: {}
    },
    actions: {
      // home页面获取文章列表
      articleList({commit}, {route}){
        var page = route.params.page || 1
        return axios.get(`api/getArticleList/home/${page}`).then(response => {
          if (response.status == 200) {
            commit('setArticleList', response.data)
          }
        }, response => {
          console.log(response)
        })
      },
      // javascript页面获取文章列表
      javaScriptList({commit}, {route}){
        var page = route.params.page || 1
        return axios.get(`api/getArticleList/javascript/${page}`).then(response => {
          if (response.status == 200) {
            commit('setArticleList', response.data)
          }
        }, response => {
          console.log(response)
        })
      },
      // article页面获取文章详情
      art({commit}, {aid, route}){
        return axios.get(`api/getArt/${aid}`).then(response => {
          if (response.status == 200) {
            commit('setArt', response.data[0])
          }
        }, response => {
          console.log(response)
        })
      }
    },
    mutations: {
      setArticleList (state, result) {
        result.articleList.forEach(article => {
          article.createTime = timeago().format(article.createTime * 1000, 'zh_CN')
        })
        state.articleResult = result
      },
      setArt(state, art){
        state.art = art
      }
    }
  })
}
