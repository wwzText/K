<template>
    <!-- 交易 -->
    <div class="header">
        <van-tabs v-model:active="state.active" type="card">
            <van-tab title="自选"></van-tab>
            <van-tab title="推荐"></van-tab>
        </van-tabs>
        <div class="coin-switch">
            <p class="coin-name" @click="state.showSwitchCoinPopup = true">
                <van-icon name="exchange" />
                {{state.coinList[state.curCoinIndex]?.coin_name}}
            </p>
            <van-icon name="chart-trending-o" @click="toKPage" size="1.8rem" />
            <van-icon @click="collectionCoin" :name="state.coinDetail?.is_c === 0 ? 'star-o' : 'star'" size="1.8rem" />

            <!-- <LabelInput label="提现地址" v-model="state.showOperation" placeholder="请输入地址"> -->
            <!-- <template v-slot:afterSlot> -->
            <van-popover placement="bottom-end" v-model:show="state.showOperation" theme="dark">
                <div>
                    <van-cell @click="toBuy" class="test">买入</van-cell>
                    <van-cell @click="toSale" class="test">卖出</van-cell>
                </div>
                <template #reference>
                    <van-icon name="ellipsis" size="1.8rem" />
                </template>
            </van-popover>
            <!-- </template> -->
            <!-- </LabelInput> -->
        </div>
    </div>
    <div class="main">
        <!-- 操作块 -->
        <div class="operation">
            <van-row>
                <van-col :span="12">
                    <div class="left">
                        <div class="transaction-type">
                            <div @click="state.transactionType = 0"
                                :class="state.transactionType === 0 ? 'sales transaction-item' : 'transaction-item'">买入
                            </div>
                            <div @click="state.transactionType = 1"
                                :class="state.transactionType === 1 ? 'buy transaction-item' : 'transaction-item'">卖出
                            </div>
                        </div>
                        <van-field v-model="state.transactionPrice" class="transaction-price" type="number" />
                        <p class="approximately-number">≈ ¥ {{state.coinDetail.coin_cny}}</p>
                        <div class="coin-num-content">
                            <van-field v-model="state.coinNumber" class="coin-number" type="number">
                                <template #button>
                                    <span class="coin-name">{{state.coinDetail.coin_name}}</span>
                                </template>
                            </van-field>
                            <div class="coin-proportion-group">
                                <span @click="state.coinNumber = Number(state.coinDetail.user_coin) * .25">25%</span>
                                <span @click="state.coinNumber = Number(state.coinDetail.user_coin) * .5">50%</span>
                                <span @click="state.coinNumber = Number(state.coinDetail.user_coin) * .75">75%</span>
                                <span @click="state.coinNumber = Number(state.coinDetail.user_coin)">100%</span>
                            </div>
                        </div>
                        <div class="guiji-con">
                            <p class="approximately-number">可用 {{state.transactionType === 0 ?
                            state.coinDetail.user_usdt_coin : state.coinDetail.user_coin}} {{state.transactionType
                                === 0 ? 'USDT' : state.coinDetail.coin_name}}</p>
                        </div>
                        <div style="flex: 1;"></div>
                        <p class="transaction-number">交易额：{{transactionAmount}} USDT</p>
                        <van-button @click="handleSale"
                            :class="state.transactionType === 0 ? 'buy transaction-btn' : 'sale transaction-btn'"
                            size="small">{{state.transactionType === 0 ? '买入' : '卖出'}}</van-button>
                    </div>
                </van-col>
                <van-col :span="12">
                    <!-- <div class="transaction-record-group">
                        <div v-for="(item, index) in transactionRecord" class="transaction-record" :key="index">
                            <span>{{ item.price }}</span>
                            <span>{{ item.number }}</span>
                        </div>
                    </div> -->
                    <div class="coin-type">
                        <div>
                            <span class="coin-price">
                                <van-icon></van-icon>
                                {{state.coinDetail.new_price}}
                            </span>
                            <span class="coin-change-ratio">+{{state.coinDetail.p}}%</span>
                        </div>
                        <span class="ratio-rmb">¥{{state.coinDetail.coin_cny}}</span>
                        <div class="increase-item">
                            <span :style="{color: '#666'}">价格</span>
                            <span class="increase-ratio">数量</span>
                        </div>
                        <template v-for="(item, index) in state.otherOrderList" :key="index">
                            <div v-if="index < 5" class="increase-item" @click="state.transactionPrice = Number(item.coin_price)">
                                <span class="increase-type">{{ item.coin_price }}</span>
                                <span class="increase-ratio">{{ item.coin_num }}</span>
                            </div>
                        </template>
                        <van-empty v-if="state.orderList.length === 0" description="" size="mini"></van-empty>
                    </div>
                </van-col>
            </van-row>
        </div>

        <!-- 当前委托单 -->
        <div class="order">
            <div class="order-header">
                <span class="title">当前委托</span>
                <p class="all" @click="router.push('/orderList')">
                    <van-icon size="1.4rem" name="balance-list-o" />
                    全部
                </p>
            </div>
            <van-empty v-if="state.orderList.length === 0" description="暂无交易订单"></van-empty>
            <div v-else class="transaction-order">
                <van-row>
                    <van-col>数量</van-col>
                    <van-col>价格</van-col>
                </van-row>
                <van-row v-for="(item, index) in state.orderList" :key="index">
                    <van-col>{{item.coin_num}}</van-col>
                    <van-col>{{item.coin_price}}</van-col>
                </van-row>
            </div>
        </div>
    </div>

    <van-popup v-model:show="state.showSwitchCoinPopup" position="left" :style="popupStyle">
        <p class="popup-title">{{state.active === 1 ? '币币' : '自选'}}</p>
        <van-cell :style="{
            paddingLeft: 0,
            paddingRight: 0
        }" v-for="(item, index) in state.coinList" @click="state.curCoinIndex = index" :key="index">
            <div class="coin-item">
                <span>{{item.coin_name}}</span>
                <span>${{item.new_price}}</span>
                <span :class="item.p.includes('-') ? 'coin-down' :'coin-up'">{{item.p}}</span>
            </div>
        </van-cell>
    </van-popup>
</template>


<script lang="ts" setup>
import { Notify } from 'vant';
import router from '../../router';
import { useUserInfoStore } from '../../store';
import { bibiCoinItem, bibiCoinDetail } from '../../types/response';
import Request from '../../utils/request';

const userInfo = useUserInfoStore();
// 弹出框样式
const popupStyle = {
    width: '80vw',
    height: '100%',
    backgroundColor: 'white',
    padding: '1rem 3rem',
    boxSizing: 'border-box'
}
type orderItem = {
    coin_name: string,//		币种
    coin_num: string,//		数量
    coin_price: string,//		价格
    pay_num: string,//		成交数量
    pay_price: string,//		成交价格
    status: number,	//	1进行中2已完成3撤回
    order_num: number,//		成交额（USDT）
    add_time: string
}
const state = reactive({
    curCoinIndex: 0,
    showSwitchCoinPopup: false,
    coinList: [] as bibiCoinItem[],
    coinDetail: {} as bibiCoinDetail,
    active: 1, // 0 自选，1 币币
    // transactionAmount: 0, // 交易金额
    transactionType: 0, // 0买入/1卖出
    transactionPrice: 0,  // 交易价格
    coinNumber: 0, // 交易数量
    showOperation: false,
    orderList: [] as orderItem[], // 订单列表
    otherOrderList: [] as orderItem[], // 订单列表

    showKCanvase: false,

    // K线
    kItem: 0,
    kCanvasIndex: "1",
    showMoreK: false,
    // pkData: [] as pkItem[]
})

const toKPage = () => {
    router.push({
        path: "/k",
        query: {
            coin_name: state.coinList[state.curCoinIndex].coin_name
        }
    })
}

// 获取盘口数据
// const getPKData = async () => {
//     state.pkData = await Request({
//         url: "user/get_pk",
//         data: {
//             coin_name: state.coinList[state.curCoinIndex].coin_name,
//             num: 5
//         }
//     })
// }

const transactionAmount = computed({
    get: () => (state.transactionPrice || 0) * (state.coinNumber || 0),
    set: () => { }
})

const toBuy = () => {
    router.push('/recharge');
};
const toSale = () => router.push('/withdrawal')

// 获取币种列表
const getCoinList = async (type: number) => {
    state.coinList = []
    // 币币不带地址查询币种列表
    let data = type === 0 ? {
        address: userInfo.$state.address
    } : {}
    let result = await Request({
        url: "pledge/coin_list2",
        data
    })

    if (type === 0 && result.length === 0) {
        Notify({
            type: "danger",
            message: "尚未添加自选",
            onOpened: () => {
                state.active = 1
            }
        })
        return false;
    }
    state.coinList = result;
    return true
}

const getTransactionOrderList = async () => {
    state.orderList = await Request({
        url: "buy/buy_coin_order_list",
        data: {
            address: userInfo.address,
            coin_name: state.coinList[state.curCoinIndex]['coin_name'],
            page: 1,
            num: 5
        }
    })
    state.otherOrderList = await Request({
        url: "buy/buy_coin_order_list",
        data: {
            coin_name: state.coinList[state.curCoinIndex]['coin_name'],
            page: 1,
            num: 5
        }
    })
}

// 获取详情
const getCoinDetail = async () => {
    state.coinDetail = await Request({
        url: "pledge/coin_info",
        data: {
            coin_name: state.coinList[state.curCoinIndex]['coin_name'],
            address: userInfo.$state.address
        }
    })
    // getPKData()
}

// 执行卖出
const handleSale = async () => {
    if (!Number(state.transactionPrice)) {
        Notify({
            type: "danger",
            message: "请输入卖出价格"
        })
        return;
    }
    if (!Number(state.coinNumber)) {
        Notify({
            type: "danger",
            message: "请输入卖出数量"
        })
        return;
    }
    let coin_name = state.coinList[state.curCoinIndex]?.coin_name
    if (Number(state.coinDetail.user_coin) < Number(state.coinNumber)) {
        Notify({
            type: "danger",
            message: coin_name + "可用余额不足，无法卖出"
        })
        return;
    }
    let result = await Request({
        url: "buy/buy_coin",
        data: {
            address: userInfo.address,
            coin_name: coin_name,
            coin_price: state.transactionPrice,
            coin_num: state.coinNumber,
            type: state.transactionType === 0 ? '1' : '2'
        },
        method: "POST"
    })
    if (result === '') {
        Notify({
            type: "success",
            message: "挂单成功"
        })
    }
}

// 收藏/取消
const collectionCoin = async () => {
    let url = state.coinDetail.is_c === 0 ? 'user/add_to_coin' : 'user/del_to_coin';

    await Request({
        url,
        data: {
            address: userInfo.$state.address,
            coin_name: state.coinDetail['coin_name']
        },
        method: 'post'
    })
    Notify({
        type: 'success',
        message: state.coinDetail.is_c === 0 ? '收藏成功' : '取消成功'
    })
    getCoinDetail()
}

// 监听自选/币币变化
watch(() => state.active, (val) => {
    getCoinList(val)
        .then(res => {
            if (res) {
                getCoinDetail()
                getTransactionOrderList()
            }
        })
}, {
    immediate: true
})

// 选择后重新拉取详情数据
watch(() => state.curCoinIndex, (val) => {
    getCoinDetail()
})


const transactionRecord = reactive([ //交易记录
    {
        price: '价格',
        number: '数量'
    }
])
const increaseList = reactive([ // 涨幅列表
    {
        start: '100',
        ratio: '20',
        rat: '10%'
    }, {
        start: '100',
        ratio: '20',
        rat: '100%'
    }, {
        start: '100',
        ratio: '20',
        rat: '50%'
    }, {
        start: '100',
        ratio: '20',
        rat: '0%'
    }
])

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.pk-title {
    display: flex;
    font-size: 1rem;
    color: #666;
    background-color: white;

    span {
        padding: 1.2rem .8rem .8rem;
        color: #666;
    }

    .pk-price {
        flex: 1;
        text-align: center;
    }

    .up-color {
        color: @up-color;
    }
}





.test {
    background-color: transparent;

    :deep(.van-cell__value) {
        color: white !important;
    }
}

.header {
    background-color: white;
    padding: 2rem 1rem 1rem;
    margin-bottom: 1rem;

    :deep(.van-tab) {
        border-color: #D5D9DD;
    }

    :deep(.van-tabs__nav) {
        border-color: #D5D9DD;
        margin: 0;
    }

    :deep(.van-tab--active) {
        background-color: #F2F4F7;
    }

    :deep(.van-tab__text) {
        color: #768B9D;
    }

    .coin-switch {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;

        .coin-name {
            font-size: 1.6rem;
            font-weight: 900;
            flex: 1;
        }

        .van-icon-chart-trending-o,
        .van-icon-star-o,
        .van-icon-star,
        .van-icon-ellipsis {
            font-weight: 600;
            margin-left: 1rem;
        }

        .van-icon-star {
            color: @theme-color;
        }
    }
}

.main {
    flex: 1;
    overflow: auto;

    .operation {
        background-color: white;
        min-height: 10rem;
        border-top-left-radius: 2rem;
        border-top-right-radius: 2rem;

        .van-col {
            padding: 2rem 1rem;
        }

        .left {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .transaction-type {
            background-color: @tip-color;
            display: flex;
            text-align: center;
            width: 100%;
            border-radius: .5rem;
            overflow: hidden;

            .transaction-item,
            .active {
                text-align: center;
                flex: 1;
                font-size: 1.4rem;
                padding: .5rem 0;
                color: @tip-text-color;
            }

            .sales {
                position: relative;
                background-color: @down-color;
                color: white;

                &::after {
                    content: "";
                    position: absolute;
                    border-top: 1.5rem solid transparent;
                    border-bottom: 1.5rem solid transparent;
                    border-left: 1rem solid @down-color;
                    border-right: 1rem solid transparent;
                    // transform: rotate(90deg);
                    right: -2rem;
                    top: 0;
                }
            }

            .buy {
                position: relative;
                background-color: @up-color;
                color: white;

                &::after {
                    content: "";
                    position: absolute;
                    border-top: 1.5rem solid transparent;
                    border-bottom: 1.5rem solid transparent;
                    border-left: 1rem solid transparent;
                    border-right: 1rem solid @up-color;
                    // transform: rotate(90deg);
                    left: -2rem;
                    top: 0;
                }
            }
        }

        .transaction-price {
            border: 1px solid @border-color;
            margin-top: 1rem;
            height: 4rem;
            line-height: 4rem;
            border-radius: .5rem;
            font-size: 1.6rem;
            font-weight: 700;
            padding: 0 var(--van-cell-horizontal-padding);
            box-sizing: border-box;
        }

        .approximately-number {
            font-size: 1.2rem;
            color: @tip-text-color;
            margin-top: 1rem;
        }

        .coin-num-content {
            border: 1px solid @border-color;
            border-radius: .5rem;
            height: 8rem;
            margin-top: 1rem;
            overflow: hidden;

            .coin-number {
                box-sizing: border-box;
                height: 4rem;
                border-bottom: 1px solid @border-color;
                font-size: 1.6rem;
                font-weight: 700;

                &::after {
                    border: none;
                }

                .coin-name {
                    color: @tip-text-color;
                    font-weight: 300;
                    font-size: 1.4rem;
                }
            }

            .coin-proportion-group {
                display: flex;
                align-items: center;
                height: 4rem;

                span {
                    color: @tip-text-color;
                    flex: 1;
                    text-align: center;
                }

                span:not(:last-child) {
                    border-right: 1px solid @border-color;
                }
            }
        }

        .guiji-con {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1rem;
        }

        .transaction-number {
            font-size: 1rem;
            margin-bottom: .5rem;
        }

        .transaction-btn {
            font-size: 1.4rem;
            font-weight: 700;
            width: 100%;
            color: white;
            border-radius: .5rem;
        }

        .buy {
            background-color: @down-color;
        }

        .sale {
            background-color: @up-color;
        }

        .transaction-record-group {
            height: 12rem;

            .transaction-record {
                display: flex;
                justify-content: space-between;
                color: @tip-text-color;
            }
        }

        .coin-type {
            display: flex;
            flex-direction: column;
            margin-top: 1rem;

            .coin-price {
                color: @up-color;
                font-weight: 700;
                font-size: 1.6rem;
            }

            .coin-change-ratio {
                font-size: 1.2rem;
                background-color: @up-bg-color;
                padding: .4rem;
                color: @up-color;
            }

            .ratio-rmb {
                color: @tip-text-color;
                font-size: 1.2rem;
                margin: .4rem 0 1rem;
            }

            .increase-item {
                display: flex;
                position: relative;
                align-items: center;
                justify-content: space-between;
                padding: 1rem 2rem 1rem 0;
                margin-bottom: .4rem;

                .increase-type {
                    color: @up-color;
                    z-index: 2;
                }

                .increase-ratio {
                    color: @tip-text-color;
                    z-index: 2;
                }

                .ratio-bg {
                    position: absolute;
                    right: 0;
                    height: 100%;
                    background-color: @up-bg-color;
                }
            }

        }
    }

    .order {
        margin-top: 1rem;

        .order-header {
            background-color: white;
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            border-bottom: 1px solid @border-color;

            .title {
                font-size: 1.4rem;
                font-weight: 500;
            }

            .all {
                font-size: 1.2rem;
                color: @tip-text-color;
            }
        }
        .transaction-order {
            background-color: white;
            padding: 0 1rem;
            box-sizing: border-box;
            :deep(.van-row){
                display: flex;
                justify-content: space-between;
                padding: 1rem 0;
            }
        }
    }
}

.popup-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #333;
}

.van-cell {

    .coin-item {
        background-color: @tip-color;
        padding: 1rem;
        border-radius: .6rem;
        font-weight: 700;
        display: flex;
        justify-content: space-between;

        .coin-up {
            color: @up-color;
        }

        .coin-down {
            color: @down-color;
        }
    }
}
</style>