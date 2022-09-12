<template>
  <div class="page-content">

    <router-view></router-view>
    <!-- <van-overlay :show="showLoading" z-index="999999999999" :custom-style="{background: 'rgba(0, 0, 0, .3)'}">
      <van-loading type="spinner" class="loading" color="#FBB400">加载中....</van-loading>
    </van-overlay> -->
    <van-tabbar v-show="!hideTabbar" safe-area-inset-bottom @change="tabbarIndexChange" v-model="tabbarStore.$state.tabbarActive">
      <van-tabbar-item icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item icon="fire-o">交易</van-tabbar-item>
      <van-tabbar-item icon="friends-o">众筹</van-tabbar-item>
      <van-tabbar-item icon="gold-coin-o">资产</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { useTabbarStore, useUserInfoStore } from "./store";
const tabbarStore = useTabbarStore();

const route = useRoute();
const router = useRouter();

const hideTabbar = ref(false);
const hideTabbarPath: string[] = reactive([
  '/crowdFundingDetail',
  '/interests'
])

// tabbar 点击时修改 store 中的值
// 同时将路由重定向回tabbar
const tabbarIndexChange = (index: number) => {
  tabbarStore.$state.tabbarActive = index * 1;
  router.replace('/')
}

watch(() => route.path, (path) => {
  let tabbarActive = tabbarStore.$state.tabbarActive;

  if (hideTabbarPath.some(t => t === path)) {
    hideTabbar.value = true
  } else {
    hideTabbar.value = false;
  }
  if (path !== '/') {
    // 当跳转到非 tabbar 页面时，取消 tabbar 组件高亮显示
    tabbarStore.$state.tabbarActive = 10 + tabbarActive;
  } else {
    if (tabbarActive >= 10) {
      tabbarStore.$state.tabbarActive = tabbarActive - 10
    }
  }
})
</script>

<style scoped lang="less">
.page-content {
  height: calc(100vh - 65px);
}

:deep(.van-tabbar) {
  padding-bottom: 1rem;
}
:deep(.van-overlay){
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.van-tabbar-item) {
  font-size: 1.4rem;
}
</style>