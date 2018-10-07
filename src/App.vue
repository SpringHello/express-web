<template>
  <div id="app">
    <div class="main-header-box">
      <header id="header">
        <div id="container">
          <a href="/home" class="logo"><img :src="logo"></a>
          <nav>
            <div>
              <span>首页</span>
            </div>
            <ul>
              <li>
                <a href="/home">首页</a>
              </li>
              <li>
                <a href="/javascript">JavaScript教程</a>
              </li>
            </ul>
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
  import logo from './assets/img/logo.svg'
  import {throttle} from 'throttle-debounce';
  export default {
    name: 'app',
    data(){
      return {
        logo,
      }
    },
    mounted(){
      var pageYOffset = 0
      var header = document.getElementById('header')
      var wrapper = document.getElementById('barWrapper')
      window.addEventListener('scroll', throttle(100, function (event) {
        let p = window.pageYOffset
        if (p < pageYOffset - 100) {
          header.classList.remove('visible')
          wrapper.classList.remove('visible')
          pageYOffset = p
        } else if (p > pageYOffset + 200) {
          header.classList.add('visible')
          wrapper.classList.add('visible')
          pageYOffset = p
        }
      }))
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  #app {
    .main-header-box {
      position: relative;
      height: 5rem;
      header {
        background-color: #ffffff;
        border-bottom: 1px solid #f1f1f1;
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        transform: translateZ(0);
        transition: all .2s;
        z-index: 100;
        &.visible {
          transform: translate3d(0, -100%, 0);
        }
        #container {
          height: 5rem;
          display: flex;
          align-items: center;
          max-width: 960px;
          margin: auto;
          .logo {
            margin-right: 2rem;
          }
          nav {
            height: 100%;
            > div {
              display: none;
            }
            ul {
              height: 100%;
              display: flex;
              align-items: center;
              li {
                height: 100%;
                a {
                  height: 100%;
                  color: #71777c;
                  line-height: 5rem;
                  padding: 0px 1.6rem;
                  font-size: 1.33rem;
                  display: inline-block;
                  &:hover {
                    color: #007fff
                  }
                  &.router-link-active {
                    color: #007fff
                  }
                }
              }
            }
          }
        }
      }
    }
    .main-body-box {
      max-width: 960px;
      width: 100%;
      margin: 1.7rem auto 0rem;
      //height: 500rem;
      display: flex;
      align-items: flex-start;
      #barWrapper {
        width: 240px;
        min-width: 240px;
        margin-left: 20px;
        &.visible {
          .sideBar {
            top: 1.767rem;
          }
        }
        .sideBar {
          //background-color: #fff;
          width: inherit;
          position: fixed;
          top: 6.767rem;
          transition: top .2s;
          .ad {
            margin-bottom: 1.3rem;
            img {
              width: 100%;
            }
          }
        }
        .menuList {
          ul {
            font-size: 1.2rem;
            line-height: 2rem;
            font-weight: 600;
            padding-left: 2rem;
            list-style-type: decimal;
            a {
              color: #000;
              &.active {
                color: #007fff
              }
            }

          }
        }
      }
      .pop-flex {
        display: flex;
        width: 100%
      }
    }
  }

  @media screen and (max-width: 960px) {
    #app {
      .main-body-box {
        #barWrapper {
          display: none;
        }
      }
    }
  }

  @media screen and (max-width: 960px) {
    #app {
      header {
        #container {
          width: 98%;
          height: 5rem;
          display: flex;
          align-items: center;
          margin: auto;
          nav {
            > div {
              display: block;
            }
          }
        }
      }
    }
  }

</style>
