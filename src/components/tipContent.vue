<template>
    <div class="tip-content">
        <p class="tip-title">温馨提示</p>
        <div class="tip-value">
            <van-space size=".5rem" direction="vertical">
                <slot></slot>
            </van-space>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.tip-content {
    padding: 1rem;
    border-radius: .4rem;
    background-color: @tip-color;

    .tip-title {
        font-size: 1.2rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .tip-value {
        color: @tip-text-color;
    }
}
</style>