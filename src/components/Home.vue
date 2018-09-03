<template>
  <main id="home">
    <div class="wrapper">
      <div class="content">
        <ul class="articleList">
          <li class="item" v-for="art in articleList">
            <div class="content-box">
              <div class="info-box">
                <div class="title-row">
                  <router-link :to="`/art/${art.aid}`" target="_blank">{{art.title}}</router-link>
                </div>
                <div class="meta-row">
                  <ul class="meta-list">
                    <li>
                      <span class="meta-type">{{art.type}}</span>
                    </li>
                    <li>
                      <span class="meta-info">{{art.author}} · {{art.createTime}} · {{art.read}}次阅读</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>
  import timeago  from 'timeago.js'
  export default {
    name: 'home',
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('articleList')
    },
    data () {
      return {}
    },
    methods: {},
    computed: {
      articleList(){
        return this.$store.state.articleList
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
      }
    }
  }
</style>
