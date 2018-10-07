<template>
  <div class="pagination-wrapper">
    <a v-if="current-1>0" :href="`${baseUrl}/${current-1}`">上一页</a>
    <span v-else>上一页</span>
    <a v-for="i in page" :key="i" :class="{active:i==current}" :href="`${baseUrl}/${i}`">{{i}}</a>
    <a v-if="current<page" :href="`${baseUrl}/${current+1}`">下一页</a>
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
    .active {
      background-color: #007fff;
      color: #fff;
      border: 1px solid #007fff;
    }
  }
</style>
