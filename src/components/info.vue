<template>
    <div class="info-content" @click="handleInfoClick">
        <van-image :src="zs" class="zs"></van-image>
        <p v-if="props.title" class="title">{{ props.title }}</p>
        <div class="long"></div>
        <van-button color="black" size="mini" v-if="props.btnText">{{ props.btnText }}<van-icon name="arrow" /></van-button>
    </div>
</template>

<script lang="ts" setup>
import zs from './../assets/img/info-zs.png'
const props = defineProps(['title', 'btnText'])
const emits = defineEmits(['click'])
const handleInfoClick = () => {
    emits('click')
}
</script>

<style scoped lang="less">
.info-content {
    width: calc(100% - var(--van-padding-md) * 2);
    height: 5rem;
    border-radius: .5rem;
    margin: 0 var(--van-padding-md);
    box-sizing: border-box;
    background-image: url('@/assets/img/info-bg.png');
    background-size: 100% 100%;
    display: flex;
    align-items: center;
    padding: 0 2rem;

    .zs {
        width: 2.5rem;
    }

    .title {
        color: #6D3E21;
        margin-left: 1rem;
        font-size: 1.4rem;
    }

    .long {
        flex: 1;
    }

    .van-button {
        border-radius: 2rem;
    }
}
</style>