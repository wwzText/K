<template>
    <!-- 充值 -->
    <Header @back="navBack">
        <div @click="seeRechargeRecord" :style="{fontSize: '1.4rem'}">
            <van-icon name="todo-list-o" />
            充币记录
        </div>
    </Header>
    <div class="page-main">
        <p class="title">充币</p>
        <div class="choose-coin">
            <span class="coin-name">USDT</span>
            <span class="coin-choose">选择币种</span>
        </div>
        <div class="choose-coin">
            <span class="coin-name">BEP20</span>
            <span class="coin-choose">链类型</span>
        </div>
        <LabelInput v-model="number" type="number" placeholder="输入充币数量" />

        <van-button class="recharge-btn" :loading="state.rechargeLoading" :loading-text="state.loadingText"
            @click="hanbdleRecharge">立即充币</van-button>

        <TipContent>
            <p>*最小充值金额：<span :style="{color: '#FBB400'}">50.0USDT</span>,小于最小金额的充值将不回上账且无法退回。</p>
            <p>*请勿向上述地址充值任何非USDT资产，否则资产将不可找回。</p>
            <p>*USDT充币仅支持simple send 的方法，使用其他方法（send all）的充币暂时无法上账，请您谅解。</p>
            <p>*您充值至上述地址后，需要整个网络节点确认，3次网络确认后到账。6次网络确认后可提币</p>
            <p>*您的充值地址不回经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或邮件通知您。</p>
            <p>*请务必确认电脑及浏览器安全，防止信息被篡改或泄漏，我们推荐您使用谷歌浏览器</p>
        </TipContent>
    </div>
</template>

<script lang="ts" setup>

import Request from '../utils/request';
import { Notify } from 'vant';
import { sendTransaction } from './../utils/web3';
import { useUserInfoStore } from '../store';
const userInfo = useUserInfoStore()
const router = useRouter();
const navBack = () => {
    router.back()
}

const state = reactive({
    rechargeLoading: false,
    loadingText: '充值中'
})

// 充值数量
const number = ref(0);

const hanbdleRecharge = async () => {
    state.rechargeLoading = true;
    // if (number.value < 50) {
    //     Notify({ type: "danger", message: "充币金额不能小于50USDT" });
    //     state.rechargeLoading = false;
    //     return;
    // }

    let canRecharge = await Request({
        url: "collect/collect_add_status",
        data: {
            address: userInfo.address,
        }
    })
    if (canRecharge !== '1') {
        state.rechargeLoading = false;
        Notify({
            type: "danger",
            message: "请等待上一次充值完成"
        });

        return;
    }


    let result = await sendTransaction(number.value, userInfo.from_address);
    state.rechargeLoading = false;
    console.log('result', result)

    if (result) {
        console.log('执行post提交', {
            address: userInfo.address,
            coin_num: number.value,
            hash: result
        })
        let postResult = await Request({
            url: "collect/collect_add",
            data: {
                address: userInfo.address,
                coin_num: number.value,
                hash: result
            },
            method: "post"
        })
        number.value = 0;
        if (postResult === '') {
            Notify({
                type: "success",
                message: "充值成功，等待区块确认，确认成功前勿重复充值",
                // onOpened() {
                //     router.back()
                // },
            })
        }
    } else {
        Notify({
            type: "danger",
            message: "充值失败"
        })
    }
}

const seeRechargeRecord = () => router.push({
    path: '/flowingWater',
    query: {
        type: '1'
    }
})

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.page-main {
    padding: 0 2rem;
    background-color: white;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }

    .choose-coin {
        display: flex;
        justify-content: space-between;
        background-color: @tip-color;
        padding: 1rem 1rem;
        margin: 2rem 0;
        border: .8rem;

        .coin-name {
            font-size: 1.4rem;
            font-weight: bold;
        }

        .coin-choose {
            color: @tip-text-color;
        }
    }

    .tip {
        background-color: @tip-color;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: .8rem;

        .title {
            font-size: 1.2rem;
            border: none;
        }
    }

    .recharge-btn {
        background-color: @blue-color;
        color: white;
        width: 100%;
        margin: 1rem 0;
    }
}
</style>