<template>
    <!-- 提现 -->
    <Header @back="navBack">
        <div @click="seeRecord">
            <van-icon name="todo-list-o" />
            提币记录
        </div>
    </Header>
    <div class="page-main">
        <p class="title">提现</p>

        <div class="choose-coin">
            <span class="coin-name">USDT</span>
            <!-- <van-popover v-model:show="state.showChooseCoinPopover" theme="dark">
                <div>
                    <van-cell @click="state.chooseCoin = item" :key="index" v-for="(item, index) in state.coinList">
                        {{item.coin_name}}</van-cell>
                </div>
                <template #reference>
                    <span class="coin-choose" id="chooseCoin" @click="showChooseCoin">选择币种
                        <van-icon name="arrow" />
                    </span>
                </template>
            </van-popover> -->
        </div>

        <!-- <LabelInput label="提现地址" v-model="state.chooseAddress" placeholder="请输入地址">
            <template v-slot:afterSlot>
                <van-popover placement="bottom-end" v-model:show="state.showChooseAddressPopover" theme="dark">
                    <div>
                        <van-cell @click="state.chooseAddress = item.to_address" :key="index"
                            v-for="(item, index) in state.addrssList">
                            {{hiddenAddress(item.to_address)}}</van-cell>
                    </div>
                    <template #reference>
                        <van-icon size="1.8rem" color="#333" name="scan" />
                    </template>
                </van-popover>
            </template>
        </LabelInput> -->
        <LabelInput label="提现数量" v-model="state.withdrawalNum" placeholder="请输入提现数量">
            <template v-slot:afterSlot>
                <span @click="state.withdrawalNum = state.coinDetail.user_usdt_coin" class="all-out">全部</span>
            </template>
            <template #bottom>
                <span class="last-money">可提现数量{{state.coinDetail.user_usdt_coin}}</span>
            </template>
        </LabelInput>
        <LabelInput label="提现手续费" disabled v-model="state.coinDetail.teef" :suffix="state.chooseCoin['coin_name']">
        </LabelInput>
        <LabelInput label="实际到账" disabled v-model="state.daozhang" :suffix="state.chooseCoin['coin_name']"></LabelInput>
        <!-- <LabelInput label="交易密码" placeholder="请输入交易密码" v-model="state.pwd"></LabelInput> -->

        <van-button class="withdrawal-btn" :loading="state.withdrawalLoading" :loading-text="state.loadingText"
            @click="handleWithdrawal">提现</van-button>
    </div>
</template>

<script lang="ts" setup>
import Request from '../utils/request';
import { useUserInfoStore } from '../store';
import { AddressItem, bibiCoinDetail } from './../types/response';
// import { hiddenAddress } from './../utils/index';
import { Notify } from 'vant';
// import web3 from "web3";
type coinItem = {
    coin_name: string,
    coin_num: string,
    coin_lock: string,
    coin_usdt: string,
    coin_cny: string
}

const userInfo = useUserInfoStore();
const router = useRouter();

const navBack = () => {
    router.back()
}

const state = reactive({
    coinList: [] as coinItem[],
    chooseCoin: {} as coinItem,
    addrssList: [] as AddressItem[],
    // showChooseCoinPopover: false,
    showChooseAddressPopover: false,
    // chooseAddress: '',
    withdrawalNum: 0 as string | number,
    coinDetail: {} as bibiCoinDetail,
    daozhang: 0,
    // pwd: "" as string,
    withdrawalLoading: false,
    loadingText: "申请中    "
})

watch(() => state.withdrawalNum, (val) => {
    if (Number(val) > 1) {
        state.daozhang = Number(val) - state.coinDetail.teef
    } else {
        state.daozhang = 0
    }
})


onMounted(() => {
    // getCoinList();
    getAddressList();
    getCoinDetail();
});

const getCoinDetail = async () => {
    state.coinDetail = await Request({
        url: "pledge/coin_info",
        data: {
            coin_name: "USDT",
            address: userInfo.address
        }
    })
}

const getAddressList = async () => {
    state.addrssList = await Request({
        url: "user/to_address_list",
        data: {
            address: userInfo.address
        }
    })
}
const handleWithdrawal = async () => {
    state.withdrawalLoading = true;
    // if (!web3.utils.isAddress(state.chooseAddress)) {
    //     state.withdrawalLoading = false;
    //     Notify({ type: "danger", message: "请输入正确的提币地址" });
    //     return
    // }
    // if (!state.chooseAddress) {
    //     state.withdrawalLoading = false;
    //     Notify({ type: "danger", message: "请输入或选择提币地址" });
    //     return
    // }
    if (state.daozhang === 0) {
        state.withdrawalLoading = false;
        Notify({ type: "danger", message: "请输入提币金额" });
        return
    }
    if (Number(state.withdrawalNum) > Number(state.coinDetail.user_usdt_coin)) {
        state.withdrawalLoading = false;
        Notify({ type: "danger", message: "可提币数量不足，请重新输入" });
        return
    }
    // if (!state.pwd) {
    //     state.withdrawalLoading = false;
    //     Notify({ type: "danger", message: "请输入提币密码" });
    //     return
    // }
    let result = await Request({
        url: "btc/withdrawals",
        data: {
            // to_address: state.chooseAddress,
            transf_value: state.withdrawalNum,
            // pay_pwd: state.pwd,
            pay_type: "USDT",
            address: userInfo.address
        },
        method: "POST"
    })
    state.withdrawalLoading = false;
    if (result === "成功") {
        Notify({
            type: "success",
            message: "提币成功等待区块同步",
            onOpened: () => navBack()
        })
    }
}

const seeRecord = () => {
    router.push({
        path: '/flowingWater',
        query: {
            type: '2'
        }
    })
}

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

:deep(.van-cell) {
    background-color: transparent;
}

:deep(.van-cell__value) {
    color: white !important;
}

.page-main {
    padding: 0 2rem;
    background-color: white;
    box-sizing: border-box;

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
        margin: 2rem 0 1rem;
        border: .8rem;

        .coin-name {
            font-size: 1.4rem;
            font-weight: bold;
        }

        .coin-choose {
            color: @tip-text-color;
        }
    }

    .last-money {
        color: @tip-text-color;
        margin-top: 1rem;
        display: block;
        font-size: 1.2rem;
    }

    .all-out {
        color: @theme-color;
    }

    .withdrawal-btn {
        background-color: @theme-color;
        color: white;
        width: 100%;
        margin: 1rem 0;
        border-radius: .4rem;
    }
}
</style>