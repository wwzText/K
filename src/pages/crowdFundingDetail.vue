<template>
    <div class="other-page">
        <ActiveItem :item="route.query"></ActiveItem>
        <van-image radius="8px" class="img" :src="detailBg"></van-image>
        <div class="btns">
            <van-button class="cancel-btn" @click="back">返回</van-button>
            <van-button class="add-btn" v-if="route.query.status === '2'" @click="state.showPopup = true">立即参与</van-button>
        </div>

        <van-popup v-model:show="state.showPopup" class="add-number-popup">
            <van-field v-model="state.coin_num" type="digit" placeholder="请输入参与数量" />
            <span class="last-money">USDT可用余额{{state.usdtCoin}}</span>
            <van-button @click="addCrowd" :loading="state.loading" loading-text="参与中" class="add-btn" size="small">确认参与</van-button>
        </van-popup>
    </div>
</template>

<script lang="ts" setup>
import Request from '../utils/request';
import detailBg from './../assets/img/detail-bg.png';
import { useUserInfoStore } from '../store';
import { Notify } from 'vant'
const userInfo = useUserInfoStore()
const router = useRouter();
const route = useRoute();

const back = () => {
    router.back()
}

onMounted(() => getUsdtCoin())

const state = reactive({
    coin_num: 0,
    showPopup: false,
    loading: false,
    usdtCoin: 0
});

const getUsdtCoin = async () => {
    let result = await Request({
        url: "pledge/coin_info",
        data: {
            address: userInfo.address,
            coin_name: "USDT"
        }
    })
    state.usdtCoin = result.user_usdt_coin
}
const addCrowd = async () => {
    state.loading = true;
    if((Number(state.usdtCoin)) > Number(route.query.user)) {
        state.loading = false;
        Notify({
            type: "danger",
            message: "USDT可用余额不足"
        })
        return;
    }
    let result = await Request({
        url: "collect/collect_buy",
        data: {
            id: route.query.id,
            coin_num: state.coin_num,
            address: userInfo.address
        },
        method: "POST"
    })
    state.loading = false;
    if(result === '') {
        Notify({
            type: "success",
            message: "参与成功",
            onOpened: () => back()
        })
    }
}
</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.other-page {
    height: 100vh;
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0;
    top: 0;

    :deep(.add-number-popup) {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem 3rem;
        border-radius: .6rem;
        width: 80vw;
        box-sizing: border-box;

        .add-btn {
            margin-top: 2rem;
            background-color: @theme-color;
            color: white;
            width: 60%;
            border-radius: .6rem;
        }
    }
    .last-money{
        margin-top: 1rem;
        color: @tip-text-color;
        font-size: 1.2rem;
        align-self: flex-start;
    }
}

.img{
    padding: 0 1rem;
    :deep(.van-image__img){
        border-radius: .8rem;
    }
}

.btns {
    display: flex;
    align-items: center;
    justify-content: space-around;
    align-items: center;
    margin-top: 1rem;

    .cancel-btn {
        width: 30vw;
        font-size: 1.6rem;
        color: @tip-text-color;
        text-align: center;
        border: none;
        background-color: transparent;
    }

    .add-btn {
        width: 60vw;
        background-color: @theme-color;
        color: white;
    }
}
</style>