<template>
  <div class="pagination-wrapper">
    <router-link v-if="current-1>0" :to="`${baseUrl}${current==2?'':current-1}`">上一页</router-link>
    <span v-else>上一页</span>
    <router-link :to="baseUrl">1</router-link>
    <router-link v-for="i in page" v-if="i>1" :key="i" :to="`${baseUrl}${i}`">{{i}}
    </router-link>
    <router-link v-if="current<page" :to="`${baseUrl}${current+1}`">下一页</router-link>
    <span v-else>下一页</span>
  </div>
</template>
<script type="text/ecmascript-6">
  export default{
    name: 'pagination',
    props: {
      total: {
        type: Number,
        required: true
      },
      pageSize: {
        type: Number,
        default: 8
      },
      current: {
        type: Number,
        default: 1
      },
      baseUrl: {
        type: String,
        required: true
      }
    },
    data(){
      return {
        page: Math.ceil(this.total / this.pageSize)
      }
    }
  }
</script>
<style rel="stylesheet/less" lang="less">
  .pagination-wrapper {
    > a, span {
      display: inline-block;
      font-size: 14px;
      padding: 8px 13px;
      border: 1px solid #ccc;
      margin-right: 13px;
      cursor: pointer;
    }
    > span {
      cursor: not-allowed;
    }
    .router-link-exact-active {
      background-color: #007fff;
      color: #fff;
      border: 1px solid #007fff;
    }
  }
</style>
