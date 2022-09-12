<template>
    <div justify="space-between" :style="{
        background: ghost ? 'transparent' : 'white'
    }" class="header-content">
        <van-icon @click="handleBackClick" size="2rem" name="down" />
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    ghost?: boolean, // 背景色透明
}
const props = withDefaults(defineProps<Props>(), {
    ghost: false
})
const emits = defineEmits(['back'])
const handleBackClick = () => {
    emits('back')
}

</script>

<style scoped lang="less">
.header-content {
    padding: 2rem 1rem 1rem;
    box-sizing: border-box;
    align-items: center;
    display: flex;
    justify-content: space-between;
    z-index: 999;
}
.van-icon-down {
    transform: rotate(90deg);
    padding: 1rem;
}

</style>