<template>
  <div class="page-navbar">
    <!-- <mt-header title="右侧仅文字">
      <router-link to="/" slot="right">
        <mt-button>分享</mt-button>
      </router-link>
    </mt-header> -->
    <mt-navbar class="page-part" v-model="selected" :fixed="true">
      <mt-tab-item id="all">全部</mt-tab-item>
      <mt-tab-item id="good">精品</mt-tab-item>
      <mt-tab-item id="share">分享</mt-tab-item>
      <mt-tab-item id="ask">问答</mt-tab-item>
      <mt-tab-item id="job">招聘</mt-tab-item>
    </mt-navbar>
    <mt-tab-container v-model="selected">
      <mt-tab-container-item id="all">
        <list></list>
      </mt-tab-container-item>
      <mt-tab-container-item id="good">
      </mt-tab-container-item>
      <mt-tab-container-item id="share">
      </mt-tab-container-item>
      <mt-tab-container-item id="ask">
      </mt-tab-container-item>
      <mt-tab-container-item id="job">
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script type="text/ecmascript-6">

  import List from  '@/components/list.vue'

  export default {
    data() {
      return {
        selected: 'all'
      }
    },
    components: {
      List
    }
  }
</script>

<style type="">
</style>
