<template>
  <main id="home">
    <div class="wrapper">
      <div class="center">
        <div class="center-wrapper">
          <div class="header">
            <h1 class="title">基于Vue的Slider滑块组件</h1>
            <span class="desc">所属分类：前端Vue组件</span>
          </div>
          <div class="slider-wrapper">
            <Slider
              v-model="value"
              :points="points"
              :unit="unit"
              :min="min"
              :max="max"
              :step="step"
            ></Slider>
          </div>
          <div
            class="markdown-body editormd-preview-container"
            previewcontainer="true"
            style="padding: 0px"
          >
            <p>
              本期为大家带来一个基于Vue的Slider滑块组件，该组件开放大量配置用于满足实际使用中的要求
            </p>
            <pre
              class="prettyprint linenums prettyprinted"
              style=""
            ><ol class="linenums"><li class="L0"><code class="lang-javascript"><span class="pun">&lt;</span><span class="pln">template</span><span class="pun">&gt;</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">    </span><span class="pun">&lt;</span><span class="pln">div </span><span class="kwd">class</span><span class="pun">=</span><span class="str">"slider-wrapper"</span><span class="pun">&gt;</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">        </span><span class="pun">&lt;</span><span class="typ">Slider</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">           v</span><span class="pun">-</span><span class="pln">model</span><span class="pun">=</span><span class="str">"value"</span></code></li><li class="L4"><code class="lang-javascript"><span class="pln">           </span><span class="pun">:</span><span class="pln">points</span><span class="pun">=</span><span class="str">"points"</span></code></li><li class="L5"><code class="lang-javascript"><span class="pln">           </span><span class="pun">:</span><span class="pln">unit</span><span class="pun">=</span><span class="str">"unit"</span></code></li><li class="L6"><code class="lang-javascript"><span class="pln">           </span><span class="pun">:</span><span class="pln">min</span><span class="pun">=</span><span class="str">"min"</span></code></li><li class="L7"><code class="lang-javascript"><span class="pln">           </span><span class="pun">:</span><span class="pln">max</span><span class="pun">=</span><span class="str">"max"</span></code></li><li class="L8"><code class="lang-javascript"><span class="pln">           </span><span class="pun">:</span><span class="pln">step</span><span class="pun">=</span><span class="str">"step"</span></code></li><li class="L9"><code class="lang-javascript"><span class="pln">        </span><span class="pun">&gt;&lt;/</span><span class="typ">Slider</span><span class="pun">&gt;</span></code></li><li class="L0"><code class="lang-javascript"><span class="pln">    </span><span class="pun">&lt;/</span><span class="pln">div</span><span class="pun">&gt;</span></code></li><li class="L1"><code class="lang-javascript"><span class="pun">&lt;/</span><span class="pln">template</span><span class="pun">&gt;</span></code></li><li class="L2"><code class="lang-javascript"><span class="pun">&lt;</span><span class="pln">script</span><span class="pun">&gt;</span></code></li><li class="L3"><code class="lang-javascript"><span class="com">//引入组件</span></code></li><li class="L4"><code class="lang-javascript"><span class="kwd">import</span><span class="pln"> </span><span class="typ">Slider</span><span class="pln"> from </span><span class="str">"@/components/Slider/Slider.vue"</span><span class="pun">;</span></code></li><li class="L5"><code class="lang-javascript"><span class="kwd">export</span><span class="pln"> </span><span class="kwd">default</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L6"><code class="lang-javascript"><span class="pln">    components</span><span class="pun">:</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L7"><code class="lang-javascript"><span class="pln">        </span><span class="typ">Slider</span><span class="pun">,</span></code></li><li class="L8"><code class="lang-javascript"><span class="pln">      </span><span class="pun">},</span></code></li><li class="L9"><code class="lang-javascript"><span class="pln">      data</span><span class="pun">()</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L0"><code class="lang-javascript"><span class="pln">        </span><span class="kwd">return</span><span class="pln"> </span><span class="pun">{</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">            </span><span class="com">//当前默认选中的值</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">            value</span><span class="pun">:</span><span class="pln"> </span><span class="lit">40</span><span class="pun">,</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">            </span><span class="com">//需要作出标记的值</span></code></li><li class="L4"><code class="lang-javascript"><span class="pln">            points</span><span class="pun">:</span><span class="pln"> </span><span class="pun">[</span><span class="lit">20</span><span class="pun">,</span><span class="pln"> </span><span class="lit">50</span><span class="pun">],</span></code></li><li class="L5"><code class="lang-javascript"><span class="pln">            </span><span class="com">//标记的单位</span></code></li><li class="L6"><code class="lang-javascript"><span class="pln">            unit</span><span class="pun">:</span><span class="pln"> </span><span class="str">"M"</span><span class="pun">,</span></code></li><li class="L7"><code class="lang-javascript"><span class="pln">            </span><span class="com">//最小值，默认为0</span></code></li><li class="L8"><code class="lang-javascript"><span class="pln">            min</span><span class="pun">:</span><span class="pln"> </span><span class="lit">0</span><span class="pun">,</span></code></li><li class="L9"><code class="lang-javascript"><span class="pln">            </span><span class="com">//最大值，默认为100</span></code></li><li class="L0"><code class="lang-javascript"><span class="pln">            max</span><span class="pun">:</span><span class="pln"> </span><span class="lit">100</span><span class="pun">,</span></code></li><li class="L1"><code class="lang-javascript"><span class="pln">            </span><span class="com">//最小步长默认为1</span></code></li><li class="L2"><code class="lang-javascript"><span class="pln">            step</span><span class="pun">:</span><span class="pln"> </span><span class="lit">1</span><span class="pun">,</span></code></li><li class="L3"><code class="lang-javascript"><span class="pln">        </span><span class="pun">｝</span></code></li><li class="L4"><code class="lang-javascript"><span class="pln">    </span><span class="pun">};</span></code></li><li class="L5"><code class="lang-javascript"><span class="pln">  </span><span class="pun">},</span></code></li><li class="L6"><code class="lang-javascript"><span class="pun">}</span></code></li></ol></pre>
            <p>
              注意：使用该组件之前要设置组件外部容器的宽！<br /><a
                target="_blank"
                href="https://pan.baidu.com/s/1Z-7U4fC3CwqjbR5EwZaNew"
                >点击下载该组件</a
              >
              提取码:ijfg
            </p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import titleMixin from "@/util/title-mixin";
import Slider from "@/components/Slider/Slider.vue";
export default {
  name: "vueDemo02",
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
    Slider,
  },
  data() {
    return {
      value: 40,
      points: [20, 50],
      unit: "M",
      min: 0,
      max: 100,
      step: 2,
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
        .slider-wrapper {
          width: 250px !important;
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
        .slider-wrapper {
          width: 600px;
          margin: 0px auto 1rem;
        }
      }
    }
  }
}
</style>
