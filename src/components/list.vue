<template lang="html">
  <div class="container" v-show="dataList.length > 0" ref="container">
      <!--mescroll滚动区域的基本结构-->
      <MeScrollVue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
        <ul class="topic-list" ref="topiclist">
          <li class="topic-item" v-for="(topic,index) in dataList" :key="index">
            <router-link :to="{ name: 'detail', params: {id : topic.id} }">
              <!-- <h3 :title="getTabInfo(topic.tab,topic.good,topic.top,false)" class="title single-row" :class="getTabInfo(topic.tab,topic.good,topic.top,true)">{{topic.title}}</h3> -->
              <div class="info">
                <img :src="topic.author.avatar_url" alt="用户头像" class="user-avatar">
                <div class="content">
                  <p>
                    <span class="name">{{topic.author.loginname}}</span>
                    <span class="status"><b>{{topic.reply_count}}</b> /{{topic.visit_count}}</span>
                  </p>
                  <p>{{topic.title}}</p>
                  <p>
                    <time>{{topic.last_reply_at | formatDate}}</time>
                  </p>
                </div>
              </div>
            </router-link>
          </li>
        </ul>
      </MeScrollVue>
  </div>
</template>

<script>
  import MeScrollVue from 'mescroll.js/mescroll.vue'
  import axios from 'axios'
  import * as util from '../assets/js/utils.js'

  export default {
    name: 'list',
    components: {
      MeScrollVue
    },
    props: {
      typeLable: {
        type: String,
        default: 'all',
        required: false
      }
    },
    data() {
      return {
        mescroll: null,
        mescrollDown: {},
        mescrollUp: {
          callback: this._loadData,
          lazyLoad: {
            use: true
          },
          page: {
            num: 0,
            size: 20
          },
          toTop: {
            src: './static/img/mescroll-totop.png',
            offset: 1000
          }
        },
        dataList: [],
        params: {
          page: 1,
          limit: 20,
          tab: 'all',
          mdrender: true
        },
        title: '全部'
      }
    },
    created() {
      // 有缓存 就用缓存   没缓存 重新加载
      if (window.sessionStorage.getItem('tempData')) {
        let tempData = JSON.parse(window.sessionStorage.getItem('tempData'))

        this.dataList = tempData.dataList
        this.params = tempData.params
      } else {
        this.params.tab = this.$route.query.tab || 'all'
        // this._loadData()
      }
      console.log('topic created')
    },
    methods: {
      mescrollInit(mescroll) {
        this.mescroll = mescroll // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
      },
      _loadData: function(page, mescroll) {
        console.log('_loadData')
        this.params.page = page.num
        axios({
          url: 'https://cnodejs.org/api/v1/topics?',
          method: 'get',
          params: this.params
        }).then(res => {
          console.log('load dataList success!')
          let arr = res.data.data

          if (this.params.page === 1) this.dataList = []
          // 把请求到的数据添加到列表
          this.dataList = this.dataList.concat(arr)
          // 数据渲染成功后,隐藏下拉刷新的状态
          this.$nextTick(() => {
            mescroll.endSuccess(arr.length)
          })

        }).catch(error => {
          mescroll.endErr()
          console.log('load dataList failed!' + error)
        })
      },
      changeNavAndMask: function() {
        this.showNav = !this.showNav
      }
    },
    filters: {
      formatDate: function(value) {
        return util.formatDate(value, true)
      }
    },
    watch: {
      '$route'(to, from) { // 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch（监测变化） $route 对象
        console.log('route watch')
      }
    },
    beforeRouteEnter(to, from, next) {
      if (['detail', 'login'].indexOf(from.name) < 0) { // 如果不是从 指定页 返回 则清掉缓存
        if (window.sessionStorage.getItem('tempData')) {
          window.sessionStorage.removeItem('tempData')
        }
      }
      next(vm => {
        // 找到当前mescroll的ref,调用子组件mescroll-vue的beforeRouteEnter方法
        vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter() // 进入路由时,滚动到原来的列表位置,恢复回到顶部按钮和isBounce的配置
      })
    },
    beforeRouteUpdate(to, from, next) {
      // 同页面切换才会触发RouteUpdate,这时不会触发vue实例的钩子，所以要处理下数据
      if (to.query && to.query.tab) {
        this.params.page = 1
        this.dataList = []
      }
      console.log('route update')
      next()
    },
    beforeRouteLeave(to, from, next) {
      let tempData = {}
      // 如果是离开topic页，则缓存当前的部分参数
      if (to.name !== 'topic') {
        tempData.params = this.params
        tempData.dataList = this.dataList
        tempData.scrollTop = this.scrollTop
        tempData.title = this.title

        window.sessionStorage.setItem('tempData', JSON.stringify(tempData))
      }
      this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave() // 退出路由时,记录列表滚动的位置,隐藏回到顶部
      console.log('route leave')
      next()
    }
  }
</script>

<style lang="less">
  @import "../assets/style/common.less";

  .container {
    height: 100%;
    position: relative;
    padding-top: 45px;
    background-color: @white;
    overflow-y: scroll;
    overflow-x: hidden;

    /*通过fixed固定mescroll的高度*/
    .mescroll {
      position: fixed;
      top: 44px;
      bottom: 0;
      height: auto;

      .topic-list {
        width: 100%;

        .topic-item {
          width: 100%;
          display: block;
          padding: @padding;
          border-bottom: 1px solid #efeded;

          .title {
            color: @title;
            font-size: 12px;

            &::before {
              display: inline-block;
              content: attr(title);
              padding: 2px 6px;
              margin-top: -2px;
              font-size: @font-tag;
              border-radius: @radius;
              margin-right: @margin10;
              vertical-align: middle;
              text-align: center;
              color: @white;
              font-weight: 400;
            }

            &.top::before {
              background-color: #E74C3C
            }

            &.good::before {
              background-color: #E67E22
            }

            &.ask::before {
              background-color: #3498DB
            }

            &.job::before {
              background-color: #9B59B6
            }

            &.share::before {
              background-color: #1ABC9C
            }
          }

          .info {
            padding-top: @margin10;
            display: flex;
            flex-direction: row;

            img {
              .author-img;
              margin-right: @margin10;
            }

            .content {
              flex: 1;
              font-size: @font-info;

              p {
                display: inline-flex;
                width: 100%;
                color: @text;

                .name {
                  flex: 1;
                }

                span {
                  font-size: @font-content;

                  b {
                    color: @color42b;
                  }
                }

                time:first-of-type {
                  flex: 1;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
