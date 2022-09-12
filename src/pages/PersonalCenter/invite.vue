<!-- 身份权益 -->
<template>
    <Header @back="navBack" ghost />
    <div class="page-main">
        <p class="title">我的推广二维码</p>
        <div class="content">
            <div class="qr-content">
                <QrcodeVue :value="userInfo.$state.web_url" :size="90" level="H" />
            </div>

            <p class="invite-title">我的邀请链接</p>
            <p class="tip-text" @click="copyLink(userInfo.$state.web_url)">{{userInfo.$state.web_url}}</p>
            <p class="invite-title">我的邀请码</p>
            <p class="tip-text">{{userInfo.$state.user_sn}}</p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { copyText } from './../../utils/index';
import QrcodeVue from 'qrcode.vue'
import { Notify } from 'vant';
import { useUserInfoStore } from '../../store';

const userInfo = useUserInfoStore();

const router = useRouter();
const navBack = () => {
    router.back()
}

const copyLink = (text: string) => {
    Notify({ type: 'success', message: '复制成功！' });
    copyText(text)
}

</script>

<style scoped lang="less">
@import url('./../../assets/css/base.less');

.page-main {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: @theme-color;
    padding: 7rem 2rem 0;
    display: flex;
    flex-direction: column;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        padding-bottom: 2rem;
        color: white;
    }

    .content {
        width: 100%;
        height: 70vh;
        background-image: url('./../../assets/img/code-bg.2b5caa2e.png');
        background-size: 100% 100%;
        position: relative;

        .qr-content {
            width: 50vw;
            height: 50vw;
            background-image: url('./../../assets/img/bg-invite.28d38b93.png');
            background-size: 100% 100%;
            margin: 3rem auto 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .invite-title {
            font-size: 1.2rem;
            font-weight: 500;
            margin: 1rem 0 1rem 10vw;
        }

        .tip-text {
            font-size: 1.2rem;
            background-color: @tip-color;
            word-break: break-all;
            margin: 1rem 10vw;
            box-sizing: border-box;
            max-width: 100%;
            padding: 1rem;
            border-radius: .4rem;
        }
    }
}
</style>