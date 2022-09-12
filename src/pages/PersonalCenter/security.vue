<template>
    <!-- 安全中心 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">安全中心</p>
        <van-cell size="large" @click="toSetPwd" title="交易密码" value=设置 is-link />
    </div>
</template>

<script lang="ts" setup>

const router = useRouter();
const navBack = () => {
    router.back()
}

const toSetPwd = () => {
    router.push('/setPwd')
}

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.page-main {
    padding: 0 2rem;
    box-sizing: border-box;
    background-color: white;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }
}
</style>    