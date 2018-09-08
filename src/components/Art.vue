<template>
  <main id="article">
    <div class="wrapper">
      <div class="content">
        <div class="art-content" v-html="art.content"></div>
      </div>
    </div>
  </main>
</template>

<script>
  import ClipboardJS from 'clipboard';
  export default {
    name: 'art',
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('art', {aid: route.params.aid})
    },
    mounted(){
      let codeList = document.getElementsByTagName('code')
      for (let i = 0; i < codeList.length; i++) {
        let button = document.createElement('button')
        button.classList.add('btn')
        button.innerText = '复制代码'
        codeList[i].parentNode.appendChild(button)
      }
      var clipboard = new ClipboardJS('.btn', {
        target: function (trigger) {
          return trigger.previousElementSibling;
        }
      });
      clipboard.on('success', e => {
        this.$Message.success({
          content: '代码复制成功',
          top: 50,
          duration: 3
        })
        e.clearSelection();
      });
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
  @import '../assets/css/content.less';

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
        }
      }
    }
  }

  @media screen and (max-width: 960px) {
    #article {
      .content {
        .btn {
          display: none;
        }
      }
    }
  }
</style>
