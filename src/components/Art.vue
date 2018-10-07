<template>
  <div class="pop-flex">
    <main id="article">
      <div class="wrapper">
        <div class="content">
          <div id="art-content" class="art-content" v-html="art.content"></div>
          <div class="i-comment">
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
        <div class="menuList">
          <ul>
            <li v-for="(menu,index) in menuList"><a :href="`#${menu}`" :class="{active:index==i}" @click="i=index">{{menu}}</a></li>
          </ul>
        </div>
      </div>

    </div>
  </div>

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
      return this.$store.state.art.title + '_菜鸟前端'
    },
    keywords(){
      return this.$store.state.art.keywords
    },
    description(){
      return this.$store.state.art.description
    },
    asyncData ({store, route}) {
      // 触发 action 后，会返回 Promise
      return store.dispatch('art', {aid: route.params.aid, route})
    },
    mounted(){
      // 获取用户评论
      axios.get(`api/getArtComment/${this.art.aid}`).then(response => {
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
      // 获取localStorage保存的用户名
      this.userName = localStorage.getItem('cainiaoqianduan') || ''
      // 图片点击放大、缩小事件
      let _vue = this
      Array.prototype.forEach.call(document.getElementById('art-content').getElementsByTagName('img'), dom => {
        dom.addEventListener('click', function (event) {
          _vue.$ImgBox(event.target)
        })
      })
      /*document.getElementById('art-content').getElementsByTagName('img').forEach(dom => dom.addEventListener('click', function (event) {
       console.log(event.target)
       }))*/
    },
    data () {
      return {
        // 广告
        ads: [
          {
            img: require('../assets/img/ad/15325704291220def5d47f7d903eb33c63e9bdaee523d.png'),
            alt: '腾讯云',
            url: 'https://cloud.tencent.com/act/campus?fromSource=gwzcw.1087969.1087969.1087969'
          }
        ],
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
        // 导航选中index
        i: -1
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
        if (this.replyContent.trim() == '') {
          this.$Message.success({
            content: '请输入回复内容',
            top: 50,
            duration: 3
          })
        }
        axios.post('api/publish', {
          aid: this.art.aid,
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
        if (this.newContent.trim() == '') {
          this.$Message.success({
            content: '请输入回复内容',
            top: 50,
            duration: 3
          })
          return
        }
        axios.post('api/publish', {
          aid: this.art.aid,
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
      },
      // 文章导航
      menuList(){
        var exp = /<h2 id=".+">(.+)<\/h2>/gi, menuList = [], result
        while ((result = exp.exec(this.$store.state.art.content)) != null) {
          menuList.push(result[1].toLowerCase());
        }
        return menuList
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
    overflow-x: auto;
    .wrapper {
      .content {
        background-color: #fff;
        padding: 2rem;
        box-sizing: border-box;
        margin-bottom: 10rem;
        .i-comment {
          padding: 1.5rem 0rem;
          margin: 0px 1rem;
          .comment-item {
            border: 1px dashed #ccc;
            margin-bottom: 30px;
            .main-title {
              padding: 10px 20px 10px;
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
      .wrapper {
        .content {
          padding: 1rem;
          .btn {
            display: none;
          }
        }
      }
    }
  }
</style>
