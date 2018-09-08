<template>
  <div class="iview-msg" v-html="content">
  </div>
</template>

<script>
  export default{
    props: {
      type: {
        type: String,
        default: 'success'
      },
      content: {
        type: String,
        default: ''
      }
    },

    data(){
      return {}
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .iview-msg {
    padding: 5px;
    > div {
      display: inline-block;
      padding: 13px 29px;
      border: 1px solid #b1d4f7;
      background-color: #edf5fd;
      > span {
        font-size: 17px;
        color: #007fff;
      }
    }
  }
</style>
