<template>
  <div id="app">
    <div class="main-header-box">
      <header id="header">
        <div id="container">
          <nav>
            <div>
              <router-link to="/">C</router-link>
              <router-link to="/javascript">JS</router-link>
            </div>
          </nav>
        </div>
      </header>
    </div>
    <div class="main-body-box">
      <router-view></router-view>
    </div>
    <div class="main-foot-box">
      <span>Copyright © 2020-2020</span>
      <a target="_blank" href="http://www.jrookie.com">编程语言网</a>
      <a target="_blank" href="http://www.jrookie.com">jrookie.com</a>
      All Rights Reserved. 备案号：
      <a target="_blank" rel="nofollow" href="https://beian.miit.gov.cn/"
        >渝ICP备2020011904号</a
      >
      <a target="_blank" href="http://www.jrookie.com/sitemap">站点地图</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {};
  },
};
</script>

<style rel="stylesheet/less" lang="less">
@import "./assets/css/variables.less";
#app {
  .main-header-box {
    position: relative;
    height: 4rem;
    background-color: @mainColor;
    header {
      border-bottom: 1px solid #f1f1f1;
      #container {
        height: 100%;
        display: flex;
        align-items: center;
        max-width: @maxWidth;
        margin: auto;
        nav {
          height: 100%;

          > div {
            height: 100%;
            display: flex;
            align-items: center;
            a {
              height: 100%;
              color: white;
              line-height: 4rem;
              padding: 0px 1.6rem;
              font-size: 1.33rem;
              display: inline-block;
            }
          }
        }
      }
    }
  }
  .main-body-box {
    margin-bottom: 1rem;
    width: 100%;
    margin-top: 1rem;
    display: flex;
    align-items: flex-start;
  }
  .main-foot-box {
    background: #fff;
    text-align: center;
    color: #999;
    padding: 2rem 0rem;
    a {
      color: #999;
    }
  }
}
</style>
