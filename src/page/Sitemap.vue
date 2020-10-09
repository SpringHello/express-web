<template>
  <main id="home">
    <div class="wrapper">
      <div class="center">
        <h1>站点地图</h1>
        <ul>
          <li
            v-for="catalog in siteMap"
            :key="catalog.articleUrl"
            :class="{ active: catalog.articleUrl == $route.path }"
            :title="catalog.articleTitle"
          >
            <router-link :to="catalog.articleUrl">{{
              catalog.articleTitle
            }}</router-link>
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<script>
import titleMixin from "@/util/title-mixin";
import api from "@/api/api";
export default {
  name: "sitemap",
  mixins: [titleMixin],
  title() {
    return "站点地图 | 编程语言网";
  },
  keywords() {
    return "站点地图、编程语言网";
  },
  description() {
    return "站点地图、编程语言网";
  },
  data() {
    return {};
  },
  methods: {},
  asyncData({ store, route }) {
    return api.getSitemap().then((response) => {
      store.state.siteMap = response.data;
    });
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
    siteMap() {
      return this.$store.state.siteMap;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$options.asyncData) {
        vm.$options.asyncData({ store: vm.$store, route: to });
      }
    });
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
<style rel="stylesheet/less" lang="less" scoped>
@import "../assets/css/variables.less";
@media handheld, only screen and (max-width: 960px) {
  #home {
    .wrapper {
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
  background-color: white;
  .wrapper {
    .center {
      width: 100%;
      padding: 0rem 1rem;
      box-sizing: border-box;
      h1 {
        font-size: 2rem;
        margin: 1rem 0rem;
      }
      li {
        position: relative;
        padding-left: 2rem;
        font-size: 1.5rem;
        &::before {
          display: block;
          content: "";
          width: 1rem;
          height: 1rem;
          border-radius: 50%;
          background: coral;
          position: absolute;

          left: 0rem;
          top: 50%;
          transform: translateY(-50%);
        }
        padding-left: 2rem;

        margin: 0rem 0rem 1rem 1rem;
      }
    }
  }
}
</style>
