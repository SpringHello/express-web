<template>
  <main id="home">
    <div class="wrapper">
      <div class="center">
        <div class="center-wrapper">
          <div class="header">
            <h1 class="title">基于Vue的翻滚轮播（跑马灯）组件</h1>
            <span class="desc">所属分类：前端Vue组件</span>
          </div>
          <div class="carousel-wrapper">
            <Carousel :urls="urls"></Carousel>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import Carousel from "@/components/Carousel/Carousel.vue";
export default {
  name: "vueDemo01",
  components: {
    Carousel,
  },
  data() {
    return {
      urls: [
        require("@/assets/img/vueDemo/01/timg.jpg"),
        require("@/assets/img/vueDemo/01/aa.jpg"),
        require("@/assets/img/vueDemo/01/bb.jpg"),
        require("@/assets/img/vueDemo/01/cc.jpg"),
      ],
    };
  },
};
</script>

<style rel="stylesheet/less" lang="less" scoped>
@import "../../assets/css/variables.less";
@media handheld, only screen and (max-width: 960px) {
  #home {
    .wrapper {
      .center {
        padding: 0rem !important;
        width: 100% !important;
        margin: 0rem !important;
        .carousel-wrapper {
          width: 250px !important;
          height: 125px !important;
          margin: 0px auto !important;
        }
      }
    }
  }
}
#home {
  width: 100%;
  max-width: @maxWidth;
  margin: 0rem auto;
  background-color: white;
  .wrapper {
    .center {
      width: 100%;

      box-sizing: border-box;
      .center-wrapper {
        padding: 20px;
        .header {
          border-bottom: 1px solid #ccc;
          margin-bottom: 2rem;
          .title {
            margin-bottom: 1rem;
          }
          .desc {
            color: #333;
            margin-bottom: 0.5rem;
            display: inline-block;
          }
        }
        .carousel-wrapper {
          width: 600px;
          height: 300px;
          margin: 0px auto;
        }
      }
    }
  }
}
</style>
