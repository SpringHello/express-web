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
            <Carousel
              :urls="urls"
              :interval="interval"
              :row="row"
              :column="column"
            ></Carousel>
          </div>

          <div
            class="markdown-body editormd-preview-container"
            previewcontainer="true"
            style="padding: 20px"
          >
            <p>
              本期为大家带来一个基于Vue的滚动轮播组件，该组件使用CSS3
              transform属性完成图片滚动切换效果。以下是该组件的使用方法
            </p>
            <pre
              class="prettyprint linenums prettyprinted"
              style=""
            ><ol class="linenums"><li class="L0"><code class="lang-javascript"><span class="pun">&lt;</span><span class="pln">template</span><span class="pun">&gt;</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">    </span><span class="pun">&lt;</span><span class="pln">div </span><span class="kwd">class</span><span class="pun">=</span><span class="str">"carousel-wrapper"</span><span class="pun">&gt;</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">        </span><span class="pun">&lt;</span><span class="typ">Carousel</span><span class="pln"> </span><span class="pun">:</span><span class="pln">urls</span><span class="pun">=</span><span class="str">"urls"</span><span class="pln"> </span><span class="pun">:</span><span class="pln">interval</span><span class="pun">=</span><span class="str">"interval"</span><span class="pln"> :row</span><span class="pun">=</span><span class="str">"row"</span><span class="pln"> :column</span><span class="pun">=</span><span class="str">"column"</span><span class="pun">&gt;&lt;/</span><span class="typ">Carousel</span><span class="pun">&gt;</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">    </span><span class="pun">&lt;/</span><span class="pln">div</span><span class="pun">&gt;</span></code></li><li class="L4"><code class="lang-javascript"><span class="pun">&lt;/</span><span class="pln">template</span><span class="pun">&gt;</span></code></li><li class="L5"><code class="lang-javascript"><span class="pun">&lt;</span><span class="pln">script</span><span class="pun">&gt;</span></code></li><li class="L6"><code class="lang-javascript"><span class="com">//引入组件</span></code></li><li class="L7"><code class="lang-javascript"><span class="kwd">import</span><span class="pln"> </span><span class="typ">Carousel</span><span class="pln"> from </span><span class="str">"@/components/Carousel/Carousel.vue"</span><span class="pun">;</span></code></li><li class="L8"><code class="lang-javascript"><span class="kwd">export</span><span class="pln"> </span><span class="kwd">default</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L9"><code class="lang-javascript"><span class="pln">    components</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L0"><code class="lang-javascript"><span class="pln">        </span><span class="typ">Carousel</span><span class="pun">,</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">      </span><span class="pun">},</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">      data</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">        </span><span class="kwd">return</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L4"><code class="lang-javascript"><span class="pln">        </span><span class="com">//组件轮播需要的图片（按照自己的实际情况引用）</span></code></li><li class="L5"><code class="lang-javascript"><span class="pln">          urls</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span></code></li><li class="L6"><code class="lang-javascript"><span class="pln">            require</span><span class="pun">(</span><span class="str">"@/assets/img/vueDemo/01/timg.jpg"</span><span class="pun">),</span></code></li><li class="L7"><code class="lang-javascript"><span class="pln">            require</span><span class="pun">(</span><span class="str">"@/assets/img/vueDemo/01/aa.jpg"</span><span class="pun">),</span></code></li><li class="L8"><code class="lang-javascript"><span class="pln">            require</span><span class="pun">(</span><span class="str">"@/assets/img/vueDemo/01/bb.jpg"</span><span class="pun">),</span></code></li><li class="L9"><code class="lang-javascript"><span class="pln">            require</span><span class="pun">(</span><span class="str">"@/assets/img/vueDemo/01/cc.jpg"</span><span class="pun">),</span></code></li><li class="L0"><code class="lang-javascript"><span class="pln">          </span><span class="pun">],</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">        </span><span class="com">//5000毫秒滚动一次</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">        interval</span><span class="pun">:</span><span class="lit">5000</span><span class="pun">,</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">        </span><span class="com">//每一行分多少份</span></code></li><li class="L4"><code class="lang-javascript"><span class="pln">        row</span><span class="pun">:</span><span class="lit">20</span><span class="pun">,</span></code></li><li class="L5"><code class="lang-javascript"><span class="pln">        </span><span class="com">//每一列分多少份</span></code></li><li class="L6"><code class="lang-javascript"><span class="pln">        column</span><span class="pun">:</span><span class="lit">10</span></code></li><li class="L7"><code class="lang-javascript"><span class="pln">    </span><span class="pun">};</span></code></li><li class="L8"><code class="lang-javascript"><span class="pln">  </span><span class="pun">},</span></code></li><li class="L9"><code class="lang-javascript"><span class="pun">}</span></code></li></ol></pre>
            <p>
              注意：使用该组件之前要设置组件外部容器的宽高！<br /><a
                target="_blank"
                href="https://pan.baidu.com/s/1-uW70nzFsIQTem4swnmHVw"
                >点击下载该组件</a
              >
              提取码:jknt
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import titleMixin from "@/util/title-mixin";
import Carousel from "@/components/Carousel/Carousel.vue";
export default {
  name: "vueDemo01",
  mixins: [titleMixin],
  title() {
    return "基于Vue、CSS3的翻滚轮播（跑马灯）组件 | 编程语言网";
  },
  keywords() {
    return "翻滚轮播、跑马灯";
  },
  description() {
    return "翻滚轮播、跑马灯";
  },
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
      //5000毫秒滚动一次
      interval: 5000,
      //每一行分多少份
      row: 20,
      //每一列分多少份
      column: 10,
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
