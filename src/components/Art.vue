<template>
  <main id="article">
    <div class="wrapper">
      <div class="content">
        <div class="art-content" v-html="art.content"></div>
        <div class="comment">
          <div v-for="comment in commentList" :key="comment.cid" class="comment-item">
            <div class="item-header">
              <span class="user">{{comment.user}}</span>
              <span class="createTime">{{comment.createTime}}</span>
            </div>
            <div class="item-content">
              <p>{{comment.content}}</p>
            </div>
          </div>
          <!-- Create the toolbar container -->
          <!--<div id="toolbar">
            <button class="ql-bold">Bold</button>
            <button class="ql-italic">Italic</button>
          </div>-->

          <!-- Create the editor container -->
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import axios from '../util/http'
  import ClipboardJS from 'clipboard'
  import Vue from 'vue'
  export default {
    name: 'art',
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('art', {aid: route.params.aid})
    },
    mounted(){
      // 获取用户评论
      axios.get(`api/getArtComment/${this.$route.params.aid}`).then(response => {
        this.commentList = response.data
      })
      // 添加复制代码到粘帖板功能
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
      })
      clipboard.on('success', e => {
        this.$Message.success({
          content: '代码复制成功',
          top: 50,
          duration: 3
        })
        e.clearSelection();
      })
      // 初始化富文本编辑器
      /*var toolbarOptions = [
       ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
       ['blockquote', 'code-block'],

       [{'header': 1}, {'header': 2}],               // custom button values
       [{'list': 'ordered'}, {'list': 'bullet'}],
       [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
       [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
       [{'direction': 'rtl'}],                         // text direction

       [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
       [{'header': [1, 2, 3, 4, 5, 6, false]}],

       [{'color': []}, {'background': []}],          // dropdown with defaults from theme
       [{'font': []}],
       [{'align': []}],

       ['clean']                                         // remove formatting button
       ]
       var editor = new Quill('#editor', {
       modules: {toolbar: toolbarOptions},
       theme: 'snow'
       });*/
    },
    data () {
      return {
        commentList: [],
      }
    },
    methods: {},
    computed: {
      art(){
        return this.$store.state.art
      }
    },
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
        margin-bottom: 10rem;
        > div {
          line-height: 1.5;
        }
        .comment-item {
          border-bottom: 1px dashed #ccc;
          padding: 1.5rem 0rem;
          margin: 0px 1rem;
          .item-header {
            .user {
              color: #4398ed
            }
            .createTime {
              float: right;
              color: #b7b5b5
            }
          }
          .item-content {
            margin-top: 15px;
            p {
              font-size: 14px;
              color: #333
            }
          }
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
