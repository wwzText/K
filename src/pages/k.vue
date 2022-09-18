<template>
    <Header @back="navBack">
        <p class="page-title">{{route.query.coin_name}}</p>
    </Header>
    <div class="page-main">
        <div class="coin-header" :style="{display: 'flex', justifyContent: 'space-between'}">
            <div>
                <div>
                    <span class="coin-price">
                        <van-icon></van-icon>
                        {{state.coinDetail.new_price}}
                    </span>
                    <span class="coin-change-ratio">+{{Number(state.coinDetail.p) * 100}}%</span>
                </div>
                <span class="ratio-rmb">¥{{state.coinDetail.coin_cny}}</span>
            </div>
            <div>
                <p :style="{color: '#666', textAlign: 'right'}">高 {{state.coinDetail.max_price}}</p>
                <p :style="{color: '#666', textAlign: 'right'}">低 {{state.coinDetail.min_price}}</p>
                <p :style="{color: '#666', textAlign: 'right'}">24H {{state.coinDetail.d_num}}</p>
            </div>
        </div>
        <van-tabs v-model:active="state.kTabIndex" class="canvas" color="#FBB400">
            <van-tab title="K线">
                <div class="k-type-list">
                    <span @click="state.kCanvasIndex = '1'">分时</span>
                    <span @click="state.kCanvasIndex = '2'">1分</span>
                    <span @click="state.kCanvasIndex = '3'">5分</span>
                    <span @click="state.kCanvasIndex = '4'">30分</span>
                    <van-popover v-model:show="state.showMoreK">
                        <span class="popover-span" @click="state.kCanvasIndex = '5'">1小时</span>
                        <span class="popover-span" @click="state.kCanvasIndex = '6'">4小时</span>
                        <span class="popover-span" @click="state.kCanvasIndex = '7'">1天</span>
                        <span class="popover-span" @click="state.kCanvasIndex = '8'">1周</span>
                        <span class="popover-span" @click="state.kCanvasIndex = '9'">1月</span>
                        <template #reference>
                            <span>更多</span>
                        </template>
                    </van-popover>
                </div>
                <div id="KCanvas"></div>
            </van-tab>
            <van-tab title="盘口">
                <div class="pk-title">
                    <span :style="{width: '8%'}">买盘</span>
                    <span :style="{width: '20%'}">数量（{{state.coinDetail.coin_name}}）</span>
                    <span class="pk-price">价格(USDT)</span>
                    <span :style="{width: '20%'}">数量（{{state.coinDetail.coin_name}}）</span>
                    <span :style="{width: '8%'}">卖盘</span>
                </div>
                <div :style="{overflow: 'auto', flex: 1}">

                    <div class="pk-title" v-for="(item, index) in state.pkData" :key="index">
                        <span :style="{width: '8%'}">{{index + 1}}</span>
                        <span :style="{width: '20%'}">{{item.num}}</span>
                        <span class="pk-price up-color">{{item.price}}</span>
                        <span :style="{width: '8%'}"></span>
                        <span :style="{width: '20%'}"></span>
                    </div>
                </div>
            </van-tab>
            <van-tab title="最新成交">
                <div class="order-title">
                    <span :style="{width: '12%'}">时间</span>
                    <span :style="{width: '12%'}">方向</span>
                    <span class="order-price">价格</span>
                    <span>数量</span>
                </div>
                <div :style="{overflow: 'auto', flex: 1}">
                    <div class="order-title" v-for="(item, index) in state.orderList" :key="index">
                        <span :style="{width: '12%'}">{{item.add_time}}</span>
                        <span :style="{width: '12%'}" class="sale-span">卖出</span>
                        <span class="order-price up-color">{{item.coin_price}}</span>
                        <span>{{item.coin_num}}</span>
                    </div>
                </div>
            </van-tab>
            <!-- <van-tab title="深度图">深度图</van-tab> -->
            <van-tab title="币种资料">
                <p class="coin-name">{{route.query.coin_name}}</p>
                <van-cell title="发行时间" :value="state.coinDetail.time"></van-cell>
                <van-cell title="发行总量" :value="state.coinDetail.sum_num"></van-cell>
                <van-cell title="流通总量" :value="state.coinDetail.l_num"></van-cell>
                <van-cell title="众筹价格" :value="state.coinDetail.z_price"></van-cell>
                <van-cell title="白皮书" :value="state.coinDetail.b_url"></van-cell>
                <van-cell title="官网" :value="state.coinDetail.g_url"></van-cell>
            </van-tab>
        </van-tabs>
        <div class="btns">
            <van-button @click="navBack" class="buy-btn">买入</van-button>
            <van-button @click="navBack" class="sale-btn">卖出</van-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Request from '../utils/request';
import { useUserInfoStore } from '../store';
import { bibiCoinDetail } from './../types/response';
import { formatTime } from '../utils/index';
import * as echarts from 'echarts';

const route = useRoute();
const router = useRouter();
const userInfo = useUserInfoStore();

type pkItem = {
    num: string,
    price: string
}
type KItem = {
    start_time: number,
    end_time: number,
    open_price: string,
    close_price: string,
    min_price: string,
    max_price: string
}
type orderItem = {
    add_time: string,
    coin_price: string,
    coin_num: string
}
enum KChooseItem {
    "分时" = 1,
    "一分" = 2,
    "五分" = 3,
    "三十分" = 4,
    "一个小时" = 5,
    "四个小时" = 6,
    "一天" = 7,
    "一周" = 8,
    "一月" = 9
}
const state = reactive({
    coinDetail: {} as bibiCoinDetail,
    kCanvasIndex: '7',
    kTabIndex: 0,
    pkData: [] as pkItem[],
    orderList: [] as orderItem[],
    showMoreK: false
})

const getCoinDetail = async () => {
    state.coinDetail = await Request({
        url: "pledge/coin_info",
        data: {
            coin_name: route.query['coin_name'],
            address: userInfo.address
        }
    })
}

onMounted(() => {
    getCoinDetail()
})


// 获取K线图数据
const getKData = async () => {
    let result = await Request({
        url: "user/get_k_line",
        data: {
            coin_name: route.query['coin_name'],
            type: state.kCanvasIndex
        }
    })
    const charDom = document.getElementById("KCanvas");

    let myChart = echarts.init(charDom as HTMLElement);
    type KPrice = string | number
    let KSeriesData: [KPrice, KPrice, KPrice, KPrice][] = []
    //  [
    //     ['1', '2', '3', '4'],
    //     ['4.2', '1', '3', '1'],
    //     ['3', '26', '31', '2.4'],
    //     ['4.2', '10', '13', '1'],
    //     [2.3, '21', '3', '4'],
    //     ['4.2', '1', '3', '4'],
    //     ['22', '12', '22', '4'],
    //     ['22', '12', '31', '9']
    // ]
    let categoryData: any[] = []
    result.forEach((item: KItem) => {
        categoryData.unshift(formatTime(item.start_time));
        KSeriesData.unshift([item.open_price, item.close_price, item.min_price, item.max_price])
    })

    let option = {
        animation: true,
        grid: [
            {
                left: '10%',
                right: '3%',
                height: '50%'
            },
            {
                left: '10%',
                right: '3%',
                top: '63%',
                height: '16%'
            }
        ],
        xAxis: [{
            type: 'category',
            data: categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
                z: 0
            }
        }, {
            type: 'category',
            gridIndex: 1,
            data: categoryData,
            boundaryGap: false,
            axisLine: { onZero: false },
            axisTick: { show: true },
            splitLine: { show: false },
            axisLabel: { show: false },
            min: 'dataMin',
            max: 'dataMax'
        }],
        yAxis: [
            {
                scale: true,
                splitArea: {
                    show: true
                }
            },
            {
                scale: true,
                gridIndex: 1,
                splitNumber: 2,
            }
        ],
        dataZoom: [
            {
                type: 'inside',
                xAxisIndex: [0, 100],
                start: 0,
                end: 100
            },
            {
                show: false,
                xAxisIndex: [0, 100],
                type: 'slider',
                top: '85%',
                start: 0,
                end: 100
            }
        ],
        legend: {
            bottom: 10,
            left: 'center',
            // data: ['开盘价', '收盘价', '最低价', '最高价']
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            },
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            textStyle: {
                color: '#000'
            },
            position: function (pos: number[], params: unknown, el: unknown, elRect: unknown, size: {
                viewSize: number[]
            }) {

                const obj: any = {
                    top: 10
                };
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                return obj;
            },
            formatter: (param: any) => {
                console.log(param)
                let arr: string[] = [];
                param.forEach((item: any, index: number) => {
                    if(index !== 0) {
                        arr.push(`${item.seriesName}：${item.value}<br />`)
                    }
                })
                return arr.join('');
            }
            // extraCssText: 'width: 170px'
        },
        series: [
            {
                type: 'candlestick',
                data: KSeriesData,
                itemStyle: {
                    color: '#05AD8E',
                    color0: '#FE0000',
                    borderColor: undefined,
                    borderColor0: undefined
                }
            }, {
                name: '开盘价',
                type: "line",
                data: KSeriesData.map(item => item[0]),
            }, {
                name: '收盘价',
                type: "line",
                data: KSeriesData.map(item => item[1]),
            }, {
                name: '最低价',
                type: "line",
                data: KSeriesData.map(item => item[2]),
            }, {
                name: '最高价',
                type: "line",
                data: KSeriesData.map(item => item[3]),
            }
        ],

    }
    myChart.setOption(option, true)
}


// 获取盘口数据
const getPKData = async () => {
    state.pkData = await Request({
        url: "user/get_pk",
        data: {
            coin_name: state.coinDetail.coin_name
        }
    })
}

const getOrderList = async () => {
    let list = await Request({
        url: "buy/buy_coin_order_list",
        data: {
            num: 100
        }
    })
    state.orderList = list.map((item: orderItem) => {
        return {
            ...item,
            add_time: formatTime(item.add_time, 'hh:mm:ss')
        }
    })
}

const navBack = () => router.back();

// 切换显示K线图 和 K线图内部tab切换，获取数据
watch(() => state.kTabIndex, (kTabIndex) => {
    // 获取图像数据
    switch (kTabIndex) {
        case 0:
            getKData();
            break;
        case 1:
            getPKData();
            break;
        case 2:
            getOrderList();
    }
}, { immediate: true })
watch(() => state.kCanvasIndex, () => getKData())
// 

</script>

<style scoped lang="less">
@import url('./../assets/css/base.less');

.page-title {
    font-size: 2rem;
    font-weight: 700;
    flex: 1;
    padding-left: 2rem;
    border-left: 1px solid @border-color;
}

.van-popover {
    background-color: red !important;
    display: flex;
    flex-direction: column;
}

.page-main {
    overflow: hidden;
    margin-top: .6rem;
    display: flex;
    flex-direction: column;
    background-color: white;

    :deep(.van-tabs__wrap) {
        min-height: 3rem;
    }

    .coin-header {
        padding: 1rem;
        box-sizing: border-box;
    }

    .k-type-list,
    .order-title,
    .pk-title {
        border-top: 1px solid @border-color;
        display: flex;
        align-items: center;
    }

    .order-title {

        span {
            padding: 1.2rem .8rem .8rem;
            color: #666;
        }

        .sale-span {
            color: @down-color;
        }

        .order-price {
            flex: 1;
        }
    }

    .k-type-list {
        display: flex;
        justify-content: space-between;
        text-align: center;
        font-size: 1.2rem;
        color: #666;
        background-color: white;

        :deep(.van-popover__wrapper) {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        span {
            // text-align: center;
            padding: 1.2rem 0 .8rem;
            flex: 1;
            display: block;
        }
    }

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


    .canvas {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        :deep(.van-tabs__content) {
            flex: 1;
            overflow: hidden;
        }

        :deep(.van-tab__panel) {
            height: 100%;
            display: flex;
            flex-direction: column;

            #KCanvas {
                background-color: white;
                flex: 1;
            }
        }
    }

    .coin-name {
        font-size: 1.6rem;
        font-weight: 700;
        padding: 1rem;
        border-top: 1px solid @border-color;
    }

    :deep(.van-cell) {

        .van-cell__title {
            color: @tip-text-color;
        }

        .van-cell__value {
            flex: 2;
            color: #333;
        }
    }

    .btns {
        display: flex;
        padding: 1rem 0;
        border-top: 1px solid @border-color;

        .van-button {
            flex: 1;
            color: white;
            margin: 0 1rem;
        }

        .buy-btn {
            background-color: @up-color;
        }

        .sale-btn {
            background-color: @down-color;
        }
    }

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
        display: block;
        margin: .4rem 0 1rem;
    }
}
</style>