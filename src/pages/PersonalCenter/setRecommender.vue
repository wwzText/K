<template>
    <!-- 设置推荐人 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">设置推荐人</p>
        <LabelInput label="推荐人邀请码" placeholder="请输入推荐人邀请码" v-model="code" />
        <div class="null"></div>
        <TipContent>
            <p>绑定推荐人后不可更改，请谨慎操作</p>
        </TipContent>
        <van-button class="confirm-btn">确定</van-button>
    </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const navBack = () => {
    router.back()
}

const code = ref('');

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.page-main {
    padding: 0 2rem;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    flex-direction: column;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }
    .null {
        flex: 1;
    }
    .confirm-btn{
        background-color: @blue-color;
        color: white;
        border-radius: .4rem;
        margin-top: 1rem;
    }
}
</style>    