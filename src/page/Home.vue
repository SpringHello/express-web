<template>
  <main id="home">
    <div class="wrapper">
      <div class="left">
        <nav class="menu-wrapper">
          <ul>
            <li
              v-for="catalog in articleCatalog"
              :key="catalog.articleUrl"
              :class="{ active: catalog.articleUrl == $route.path }"
              :title="catalog.articleTitle"
            >
              <router-link :to="catalog.articleUrl">{{
                catalog.articleTitle
              }}</router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="center">
        <article class="center-wrapper" v-html="articleContent"></article>
      </div>
      <div class="right"></div>
    </div>
  </main>
</template>

<script>
import titleMixin from "@/util/title-mixin";
import api from "@/api/api";
export default {
  name: "home",
  mixins: [titleMixin],
  title() {
    return this.title;
  },
  keywords() {
    return this.keywords;
  },
  description() {
    return this.description;
  },
  data() {
    return {};
  },
  methods: {},
  asyncData({ store, route }) {
    return Promise.all([
      api
        .getArticleCatalog({
          articleType: route.path.split("/")[1],
        })
        .then((response) => {
          store.state.articleCatalog = response.data;
        }),
      api
        .getArticleContent({
          articleUrl: route.path,
        })
        .then((response) => {
          store.state.articleContent = response.data.articleContent;
          store.state.title = response.data.title + " | 编程语言网";
          store.state.keywords = response.data.keywords;
          store.state.description = response.data.description;
          //store.state.articleTitle = response.data.articleTitle;
        }),
    ]);
    //api.main({}).then((response) => {});
  },
  created() {
    if (VUE_ENV === "development") {
      let { asyncData } = this.$options;
      if (asyncData) {
        asyncData({
          store: this.$store,
          route: this.$route,
        });
      }
    }
  },
  computed: {
    articleCatalog() {
      return this.$store.state.articleCatalog;
    },
    articleContent() {
      return this.$store.state.articleContent;
    },
    title() {
      return this.$store.state.title;
    },
    keywords() {
      return this.$store.state.keywords;
    },
    description() {
      return this.$store.state.description;
    },
  },
  beforeRouteUpdate(to, from, next) {
    let { asyncData } = this.$options;
    if (asyncData) {
      asyncData({
        store: this.$store,
        route: to,
      })
        .then(next)
        .catch(next);
    } else {
      next();
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/less" lang="less">
@import "../assets/css/variables.less";
@media handheld, only screen and (max-width: 960px) {
  #home {
    .wrapper {
      .left,
      .right {
        display: none;
      }
      .center {
        padding: 0rem !important;
        width: 100% !important;
        margin: 0rem !important;
      }
    }
  }
}
#home {
  width: 100%;
  max-width: @maxWidth;
  margin: 0rem auto;
  .wrapper {
    .left {
      float: left;
      width: 14%;
      .menu-wrapper {
        ul {
          background-color: white;
          padding: 0.5rem;
          li {
            background-color: #f6f4f0;
            cursor: pointer;
            border: 1px solid #f1f0ef;
            &:hover {
              font-weight: bold;
              background-color: #f8f6f3;
            }
            a {
              padding: 0.8rem 1rem;
              box-sizing: border-box;
              width: 100%;
              display: block;
              color: black;
            }
            &.active {
              background-color: @mainColor;
              a {
                font-weight: bold;
                color: white;
              }
            }
          }
        }
      }
    }
    .center {
      margin: 0% 14%;
      width: 72%;
      padding: 0rem 1rem;
      box-sizing: border-box;
      .center-wrapper {
        border: 1px solid #f1f0ef;
        background: white;
      }
    }
    .right {
      width: 14%;
      float: right;
    }
  }
}
</style>
