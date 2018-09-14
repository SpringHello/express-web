<template>
  mysql
  <main id="article">
    <div class="wrapper">
      <div class="content">
        <div class="art-content" v-html="art.content"></div>
        <div class="comment">
          <div class="reply-wrapper">
            <input type="text" v-model="userName" @focus="warning=false">
            <span :class="{warning:warning}">用户名(必填)</span>
            <textarea rows="2" v-model="newContent"></textarea>
            <button @click="newPublish">发表</button>
          </div>

          <div v-for="(comment,mainIndex) in commentList" :key="comment.cid" class="comment-item">
            <div class="main-title">
              <div class="item-header">
                <span class="user">{{comment.user}}</span>
                <span class="createTime margin">{{comment.time}}</span>
              </div>
              <div class="item-content">
                <p>{{comment.content}}</p>
                <span class="reply-btn margin" @click="_reply(comment,mainIndex)">回复</span>
              </div>
              <div v-show="comment.cid==showCommentCid" class="reply-wrapper">
                <input type="text" v-model="userName" @focus="warning=false">
                <span :class="{warning:warning}">用户名(必填)</span>
                <textarea rows="2" v-model="replyContent" ref="main"></textarea>
                <button @click="publish">发表</button>
              </div>
            </div>
            <div class="item-reply" v-if="comment.reply.length>0">
              <div v-for="(reply,subIndex) in comment.reply" class="item-reply-wrapper">
                <div class="item-header">
                  <span class="user">{{reply.user}}</span>
                  <span class="createTime">{{reply.time}}</span>
                </div>
                <div class="item-content">
                  <p>{{reply.content}}</p>
                  <span class="reply-btn" @click="_reply(reply,mainIndex,subIndex)">回复</span>
                </div>
                <div v-show="reply.cid==showCommentCid" class="reply-wrapper">
                  <input type="text" v-model="userName" @focus="warning=false">
                  <span :class="{warning:warning}">用户名(必填)</span>
                  <textarea rows="2" v-model="replyContent" ref="sub"></textarea>
                  <button @click="publish">发表</button>
                </div>
              </div>
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
  import titleMixin from '../util/title-mixin'
  import ClipboardJS from 'clipboard'
  import Vue from 'vue'
  export default {
    name: 'art',
    mixins: [titleMixin],
    title(){
      return this.$store.state.art.title + '  -菜鸟前端'
    },
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('art', {aid: route.params.aid})
    },
    mounted(){
      // 获取用户评论
      axios.get(`api/getArtComment/${this.$route.params.aid}`).then(response => {
        // this.commentList = response.data
        var list = []
        response.data.forEach(comment => {
          if (comment.pid == 0) {
            comment.reply = []
            this.set[comment.cid] = comment
            list.push(comment)
          } else {
            this.set[comment.pid].reply.push(comment)
          }
        })
        this.commentList = list
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
      this.userName = localStorage.getItem('cainiaoqianduan') || ''
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
        // 评论列表
        commentList: [],
        // 展示回复窗口的评论id
        showCommentCid: '',
        // 回复的哪条内容
        pid: '',
        // 回复内容
        replyContent: '',
        // 新评论类容
        newContent: '',
        // 用户名
        userName: '',
        // 用户名为空警告
        warning: false,
        // 扁平数据转树形数据工具对象
        set: {},
      }
    },
    methods: {
      _reply(comment, mainIndex, subIndex){
        this.replyContent = '回复 ' + comment.user + ' :'
        if (comment.pid == 0) {
          // 回复的是开帖内容 pid应置为cid 回复内容应置为空
          this.pid = comment.cid
        } else {
          // 回复的是回复内容 pid应置为pid 回复内容应置为 回复+用户名
          this.pid = comment.pid
        }
        if (subIndex !== undefined) {
          let T = 0
          for (let i = 0; i < mainIndex; i++) {
            T += this.commentList[i].reply.length
          }
          T += subIndex
          setTimeout(() => {
            this.$refs.sub[T].focus()
          }, 0)
        } else {
          setTimeout(() => {
            this.$refs.main[mainIndex].focus()
          }, 0)
        }
        this.showCommentCid = comment.cid
      },
      // 发言
      publish(){
        if (this.userName.trim() == '') {
          this.warning = true
          return
        }
        axios.post('api/publish', {
          aid: this.$route.params.aid,
          pid: this.pid,
          userName: this.userName,
          content: this.replyContent
        }).then(response => {
          if (response.status == 200) {
            this.replyContent = ''
            localStorage.setItem('cainiaoqianduan', this.userName)
            this.showCommentCid = ''
            let comment = response.data
            if (comment.pid == 0) {
              comment.reply = []
              this.set[comment.cid] = comment
              this.commentList.push(comment)
            } else {
              this.set[comment.pid].reply.push(comment)
            }
            this.$Message.success({
              content: '回复评论成功',
              top: 50,
              duration: 3
            })
          }
        })
      },
      newPublish(){
        if (this.userName.trim() == '') {
          this.warning = true
          return
        }
        axios.post('api/publish', {
          aid: this.$route.params.aid,
          pid: '0',
          userName: this.userName,
          content: this.newContent
        }).then(response => {
          if (response.status == 200) {
            this.newContent = ''
            localStorage.setItem('cainiaoqianduan', this.userName)
            this.showCommentCid = ''
            let comment = response.data
            comment.reply = []
            this.set[comment.cid] = comment
            this.commentList.push(comment)
            this.$Message.success({
              content: '发言成功',
              top: 50,
              duration: 3
            })
          }
        })
      }
    },
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
        .comment {
          padding: 1.5rem 0rem;
          margin: 0px 1rem;
          .comment-item {
            border: 1px dashed #ccc;
            margin-bottom: 30px;
            .main-title {
              padding: 10px 20px 0px;
            }
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
              overflow: hidden;
              .reply-btn {
                float: right;
                color: #4398ed;
                cursor: pointer
              }

              p {
                font-size: 14px;
                color: #333
              }
            }
            .item-reply {
              padding: 20px 20px 20px 40px;
              background-color: #f7f8fa;
              .item-reply-wrapper {
                margin-bottom: 20px;
                &:last-child {
                  margin-bottom: 0px;
                }
              }
            }
            .margin {
              //margin-right: 20px;
            }
          }
          > .reply-wrapper {
            padding-bottom: 20px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 20px;
          }
          .reply-wrapper {
            overflow: hidden;
            input {
              margin-right: 10px;
              margin-bottom: 10px;
              padding: 9px;
              font-size: 14px;
              outline: none;
              border-radius: 3px;
              border: 1px solid #ccc;
            }
            textarea {
              width: 100%;
              box-sizing: border-box;
              font-size: 14px;
              padding: 5px 10px;
              border: 1px solid #ccc;
              border-radius: 3px;
              outline: none;
            }
            .warning {
              color: #ff0000;
            }
            button {
              float: right;
              padding: 4px 12px;
              background-color: #4398ed;
              outline: none;
              border: none;
              color: #fff;
              cursor: pointer;
            }
          }
        }
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
