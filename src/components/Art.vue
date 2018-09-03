<template>
  <main id="article">
    <div class="wrapper">
      <div class="content">
        <div v-html="art.content"></div>
      </div>
    </div>
  </main>
</template>

<script>
  export default {
    name: 'art',
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('art', {aid: route.params.aid})
    },
    data () {
      return {}
    },
    methods: {},
    computed: {
      art(){
        return this.$store.state.art
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/less" lang="less">
  #article {
    flex-grow: 1;
    width: 100%;
    .wrapper {
      .content {
        background-color: #fff;
        padding: 2rem;
        box-sizing: border-box;
        > div {
          line-height: 1.5;
          /*以下是正文内容样式*/
          h1 {
            margin: .67rem 0;
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.5;
          }
          h2 {
            padding-bottom: 12px;
            font-size: 24px;
            border-bottom: 1px solid #ececec;
            margin-top: 35px;
            margin-bottom: 10px;
          }
          h3 {
            font-size: 18px;
            padding-bottom: 0;
            margin-bottom: 10px;
          }
          code {
            font-size: 15px;
            padding: 18px 15px 12px;
            white-space: pre;
            color: #333;
            display: block;
            background: #f8f8f8;
            overflow: auto;
          }
          blockquote {
            color: #666;
            padding: 1px 23px;
            margin: 22px 0;
            border-left: 4px solid #cbcbcb;
            background-color: #f8f8f8;
            white-space: pre-line;
          }
          ul {
            margin: 22px 0;
            font-size: 15px;
            padding-left: 40px;
            list-style: disc;
          }
          p {
            margin: 22px 0px;
          }
          > p {
            font-size: 15px;
            color: #333
            //white-space: pre;
          }
        }
      }
    }
  }
</style>
