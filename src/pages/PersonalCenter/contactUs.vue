<template>
    <!-- 联系我们 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">联系我们</p>
        <LabelInput label="联系邮箱" v-model="emil" disabled>
            <template v-slot:afterSlot>
                <van-button size="mini" class="copy-btn" @click="copyEmil">复制</van-button>
            </template>
        </LabelInput>
        <LabelInput label="TeleGram" v-model="telegram" disabled>
            <template v-slot:afterSlot>
                <van-button size="mini" class="copy-btn" @click="copyTelegram">复制</van-button>
            </template>
        </LabelInput>
        <TipContent :style="{marginTop: '1rem'}">
            <p>1.说说您遇到的问题，我们会尽快为您解决</p>
            <p>2.工作时间9:00～22:30</p>
        </TipContent>
    </div>
</template>

<script lang="ts" setup>
const router = useRouter();
const navBack = () => {
    router.back()
}

const emil = ref('');
const telegram = ref('');

const copyEmil = () => {};
const copyTelegram = () => {};

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
    .copy-btn{
        background-color: @blue-color;
        color: white;
        border-radius: .4rem;
    }
}
</style>    