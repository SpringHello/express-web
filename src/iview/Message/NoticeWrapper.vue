<template>
  <div class="iview-msg-wrapper">
    <Notice
      v-for="(notice,index) in _notices"
      :key="index"
      v-if="!notice.death"
      :type="notice.type"
      :content="notice.content">
    </Notice>
  </div>
</template>

<script>
  import Notice from './Notice.vue'
  export default{
    data(){
      return {
        notices: []
      }
    },
    created(){
    },
    components: {
      Notice
    },
    methods: {
      add(options){
        this.notices.push(options)
      }
    },
    computed: {
      _notices(){
        return this.notices.filter(notice => {
          return !notice.death
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .iview-msg-wrapper {
    position: fixed;
    top: 25px;
    right:50px;
    text-align: center;
    z-index: 1000;
  }
</style>
