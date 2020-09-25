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
    width: 100%;
    margin-top: 1rem;
    display: flex;
    align-items: flex-start;
  }
}
</style>
