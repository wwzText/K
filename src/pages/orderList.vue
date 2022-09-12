<template>
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">订单记录</p>
        <div class="content" v-if="state.orderList.length">
            <van-cell class="item" v-for="(item, index) in state.orderList" :key="index">
                <div class="row">
                    <span class="name">{{item.coin_name}}/USDT</span>
                    <div :style="{display: 'flex', alignItems: 'center'}">
                        <van-tag>{{E_status[item.status]}}</van-tag>
                        <van-button :loading="state.backLoading" loading-text="撤回中" v-if="item.status == 1" size="mini" class="back-btn" @click="backOrder(item.id)">撤回订单</van-button>
                    </div>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">创建时间</span>
                    <span :style="{color: '#666'}">{{item.add_time}}</span>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">数量</span>
                    <span :style="{color: '#666'}">{{item.coin_num}}</span>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">价格(USDT)</span>
                    <span :style="{color: '#666'}">{{item.coin_price}}</span>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">成交数量({{item.coin_name}})</span>
                    <span :style="{color: '#666'}">{{item.pay_num}}</span>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">成交价格(USDT)</span>
                    <span :style="{color: '#666'}">{{item.pay_price}}</span>
                </div>
                <div class="row">
                    <span :style="{fontWeight: 500}">成交金额（USDT）：</span>
                    <span :style="{color: '#666'}">{{item.order_num}}</span>
                </div>
            </van-cell>
        </div>
        <van-empty v-else description="暂无记录"></van-empty>
    </div>

</template>

<script lang="ts" setup>
import Request from '../utils/request';
import { useUserInfoStore } from '../store';
import { formatTime } from './../utils/index';
import { Notify } from 'vant';
const router = useRouter();
enum E_status {
    "进行中" = 1,
    "已完成" = 2,
    "撤回" = 3,
}

type orderItem = {
    coin_name: string,//		币种
    coin_num: string,//		数量
    coin_price: string,//		价格
    pay_num: string,//		成交数量
    pay_price: string,//		成交价格
    status: number,	//	1进行中2已完成3撤回
    order_num: number,//		成交额（USDT）
    add_time: string,
    id: number
}

const userInfo = useUserInfoStore();

const state = reactive({
    orderList: [] as orderItem[],
    backLoading: false
})

const navBack = () => router.back()

const getFlowingWaterList = async () => {
    let list = await Request({
        url: "buy/buy_coin_order_list",
        data: {
            address: userInfo.address,
            num: 100
        }
    })
    state.orderList = list.map((item: orderItem) => {
        return {
            ...item,
            add_time: formatTime(item.add_time)
        }
    })
}

const backOrder = async (id: any) => {
    state.backLoading = true;
    let result = await Request({
        url: "buy/del_order",
        data: {
            address: userInfo.address,
            id
        },
        method: "POST"
    })
    state.backLoading = false;
    if(result === "") {
        Notify({
            type: "success",
            message: "订单撤回成功"
        })
    }
}

onMounted(() => getFlowingWaterList())

</script>

<style scoped lang="less">
@import url('./../assets/css/base.less');


.page-main {
    padding: 0 2rem;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }

    .content {
        flex: 1;
        overflow: auto;
    }
}

.row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
    .back-btn{
        margin-left: 1rem;
        background-color: @blue-color;
        color: white;
        border-radius: .4rem;
    }
}

.name {
    font-weight: 700;
    font-size: 2rem;
}

.add-money {
    color: @up-color;
}

.dec-money {
    color: @down-color;
}
.item{
    border-bottom: 1px solid @border-color;
}
</style>