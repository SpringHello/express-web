<template>
  <div class="pop-flex">
    <main id="home">
      <div class="wrapper">
        <!--列表内容-->
        <div class="content">
          <div class="articleList">
            <div class="item" v-for="art in articleList">
              <div class="content-box">
                <div class="info-box">
                  <div class="title-row">
                    <router-link :to="`/art/${art.aid}`" target="_blank">{{art.title}}</router-link>
                  </div>
                  <div class="meta-row">
                    <div class="meta-list">
                      <span class="meta-type">{{art.type}}</span>
                      <span class="meta-info">{{art.author}} · {{art.createTime}} · {{art.read}}次阅读</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--<div class="item">
              <a :href="ad.url" target="_blank" v-for="(ad,index) in bottomAds" :key="index">
                <img :src="ad.img" style="width:100%">
              </a>
            </div>-->
          </div>
          <!--分页-->
          <div class="pagination">
            <pagination :total="total" :current="current" baseUrl="/"></pagination>
          </div>
        </div>
      </div>
    </main>
    <div id="barWrapper">
      <div class="sideBar">
        <div class="ad" v-for="ad in ads">
          <a :href="ad.url" target="_blank">
            <img :src="ad.img">
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import titleMixin from '../util/title-mixin'
  import timeago  from 'timeago.js'
  export default {
    name: 'home',
    mixins: [titleMixin],
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('articleList', {route})
    },
    title: '菜鸟前端_一个帮助前端入门、成长的小站',
    keywords: 'Javascript、Vue.js、前端开发、菜鸟前端',
    description: '菜鸟前端是专门为前端开发人员打造的学习平台，提供javascript入门教程、前端技术分享等内容',
    data () {
      return {
        ads: [
          {
            img: require('../assets/img/ad/15325704291220def5d47f7d903eb33c63e9bdaee523d.png'),
            alt: '腾讯云',
            url: 'https://cloud.tencent.com/act/campus?fromSource=gwzcw.1087969.1087969.1087969'
          }
        ],
        bottomAds: [
          {
            img: require('../assets/img/ad/bg2018090401.png'),
            alt: '腾讯云',
            url: 'https://cloud.tencent.com/act/campus?fromSource=gwzcw.1087969.1087969.1087969'
          }
        ]
      }
    },
    methods: {},
    computed: {
      articleList(){
        return this.$store.state.articleResult.articleList
      },
      total(){
        return this.$store.state.articleResult.total
      },
      current(){
        return Number(this.$route.params.page) || 1
      }
    },
    watch: {
      '$route' (to, from) {
        this.$store.dispatch('articleList', {route: to})
        // 对路由变化作出响应...
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/less" lang="less">
  #home {
    flex-grow: 1;
    .wrapper {
      .content {
        background-color: #fff;
        .articleList {
          .item {
            border-bottom: 1px solid rgba(178, 186, 194, 0.15);
            .content-box {
              padding: 1.167rem 2rem;
              min-height: 5.75rem;
              display: flex;
              align-items: center;
              .info-box {
                .title-row {
                  margin: .5rem 0 .8rem;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  a {
                    font-size: 1.4rem;
                    color: #2e3135;
                    font-weight: 600;
                    &:hover {
                      text-decoration: underline;
                    }
                  }
                }
                .meta-row {
                  .meta-list {
                    display: flex;
                    align-items: center;
                    .meta-type {
                      padding: .38rem 0;
                      background-color: rgb(66, 198, 125);
                      color: #fff;
                      border-radius: 2px;
                      min-width: 4.5rem;
                      display: inline-block;
                      text-align: center;
                      font-size: .8rem;
                      margin-right: 1rem;
                    }
                    .meta-info {
                      color: rgb(143, 150, 156)
                    }
                  }
                }
              }
            }
          }
        }
        .pagination {
          padding: 1.167rem 2rem;
        }
      }
    }
  }
</style>
