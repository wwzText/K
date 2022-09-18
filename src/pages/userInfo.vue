<template>
    <Header @back="navBack">
        <van-col>
            <van-icon size="2rem" name="ellipsis" />
        </van-col>
    </Header>
    <div class="page-main">
        <p class="address">HI,{{userInfoStore.$state.address}}
            <van-button size="mini" color="#F6F7FB" icon="edit">编辑</van-button>
        </p>
        <Info :style="{ marginBottom: '1rem' }" title="身份权益" btnText="查看权益" @click="seeInterests" />
        <van-cell size="large" @click="seeSecurity" title="安全中心" icon="shield-o" is-link />
        <van-cell size="large" @click="seeInvite" title="邀请好友" icon="friends-o" is-link />
        <van-cell size="large" @click="seeWithdrawalAddressList" title="提币地址" icon="refund-o" is-link />
        <van-cell size="large" @click="toHelp" title="帮助中心" icon="envelop-o" is-link />
        <van-cell size="large" @click="contactUs" title="联系我们" icon="service-o" is-link />
        <van-cell size="large" title="推荐人">
            {{hiddenAddress(userInfoStore.first_address)}}
        </van-cell>
    </div>
</template>
<script lang="ts" setup>
import { useUserInfoStore } from '../store';
import { hiddenAddress } from './../utils/index';
const router = useRouter();

const userInfoStore = useUserInfoStore()
const navBack = () => {
    router.back()
}
// 查看身份权益
const seeInterests = () => router.push('/interests');
// 安全中心
const seeSecurity = () => router.push('/security');
// 邀请二维码
const seeInvite = () => router.push('/invite');
// 提币地址
const seeWithdrawalAddressList = () => router.push('/withdrawalAddressList');
// 帮助中心
const toHelp = () => router.push('/help');
// 联系我们
const contactUs = () => router.push('/contactUs');
// 设置推荐人
// const toSetRecommender = () => {
//     router.push('/setRecommender')
// }

</script>

<style scoped lang="less">
.page-main {
    background-color: white;
}

.address {
    font-size: 2.2rem;
    font-weight: 700;
    position: relative;
    word-break: break-all;
    margin: 1rem 1rem 2rem;

    .van-button {
        position: absolute;
        right: .1rem;
        bottom: 0;
        color: #FBB400 !important;
    }
}
</style>