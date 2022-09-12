<template>
    <component :is="tabbarList[tabbarStore.$state.tabbarActive]"></component>
</template>

<script lang="ts" setup>
import { useTabbarStore } from '../store';
// 4个tabbar组件一次引入
import indexVue from './tabbar/index.vue';
import crowdFundingVue from './tabbar/crowdFunding.vue';
import moneyVue from './tabbar/money.vue';
import transactionVue from './tabbar/transaction.vue';
import { installWeb3 } from './../utils/web3';

// 实例化tabbar store 
const tabbarStore = useTabbarStore();

onMounted(() => {
    installWeb3();
    // checkRegister();
})

const tabbarList = reactive(markRaw([
    indexVue,
    transactionVue,
    crowdFundingVue,
    moneyVue,
]))


</script>

<style scoped lang="less">
.page-content {
    height: calc(100vh - 60px);
}
</style>