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
      articleList: [],
      art: {}
    },
    actions: {
      // home页面获取文章列表
      articleList({commit}, route){
        return axios.get('api/getArticleList/home').then(response => {
          if (response.status == 200) {
            commit('setArticleList', response.data)
          }
        }, response => {
          console.log(response)
        })
      },
      // javascript页面获取文章列表
      javaScriptList({commit}, route){
        return axios.get('api/getArticleList/javascript').then(response => {
          if (response.status == 200) {
            commit('setArticleList', response.data)
          }
        }, response => {
          console.log(response)
        })
      },
      // article页面获取文章详情
      art({commit}, {aid}){
        return axios.get(`api/getArt/${aid}`).then(response => {
          if (response.status == 200) {
            commit('setArt', response.data)
          }
        }, response => {
          console.log(response)
        })
      }
    },
    mutations: {
      setArticleList (state, articleList) {
        articleList.forEach(article => {
          article.createTime = timeago().format(article.createTime * 1000, 'zh_CN')
        })
        state.articleList = articleList
      },
      setArt(state, art){
        state.art = art
      }
    }
  })
}
