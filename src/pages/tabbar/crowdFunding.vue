<template>
    <!-- icons -->
    <div class="content">
        <div class="header">
            <van-tabs v-model:active="state.tabIndex" type="card" title-active-color="white" swipeable
                title-inactive-color="#FBB400" color="#FBB400">
                <template v-for="(item, index) in userInfo.coinList" :key="index">
                    <van-tab :title="item.coin_name" v-if="item.coin_name.toLocaleUpperCase() !== 'USDT'">
                        <Card class="card">
                            <van-row wrap justify="space-between" align="center">
                                <van-col :span="12">
                                    <p class="title">众筹中（USDT）</p>
                                    <p class="value">{{state.cardInfo.num1}}</p>
                                </van-col>
                                <van-col :span="12">
                                    <p class="title">收益（USDT）</p>
                                    <p class="value">
                                        {{state.cardInfo.num2}}
                                        <van-button class="get-money" @click="showGetPopup" size="mini"
                                            text="提取" />
                                    </p>
                                </van-col>
                                <van-col :span="12">
                                    <p class="title">累计收益（USDT）</p>
                                    <p class="value">{{state.cardInfo.num3}}</p>
                                </van-col>
                                <van-col :span="12">
                                    <p class="title">累计奖励（{{userInfo.coinList[state.tabIndex]['coin_name']}}）</p>
                                    <p class="value">{{state.cardInfo.num4}}</p>
                                </van-col>
                            </van-row>
                        </Card>
                    </van-tab>
                </template>

            </van-tabs>
            <div class="set">
                <p>存储爆块分配比例：{{state.coinProportionList[state.tabIndex]?.proportion}}%</p>
                <van-button color="#FBB400" @click="showSetting = true" size="mini">设置</van-button>
            </div>
        </div>
        <div class="other">
            <ActiveItem @click="activeItemClick(index)" v-for="(item, index) in state.crowdList" :key="index"
                :item="item" />
        </div>

        <van-popup v-model:show="state.popup" class="get-money-popup">
            <van-field v-model="state.coin_num" placeholder="请输入提取数量" />
            <div :style="{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between'}">
                <span class="last-money">可提取余额：</span>
                <span>{{state.cardInfo.num2}}</span>
            </div>
            <div :style="{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between'}">
                <span class="last-money">燃烧比例：</span>
                <span>50%</span>
            </div>
            <div :style="{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between'}">
                <span class="last-money">燃烧数量：</span>
                <span>{{state.coin_num / state.coinToUSDTPrice / 2}}{{userInfo.coinList[state.tabIndex]['coin_name']}}</span>
            </div>
            <div :style="{display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between'}">
                <span class="last-money">燃烧价格：</span>
                <span>{{state.coinToUSDTPrice}}</span>
            </div>
            <van-button @click="handleGet" :loading="state.getLoading" loading-text="提取中" class="add-btn" size="small">确认提取</van-button>
        </van-popup>
    </div>

    <van-popup v-model:show="showSetting">
        <div class="pop-content">
            <p class="title">存储爆块分配比例</p>
            <template v-for="(item, index) in state.saveCoinProportionList" :key="index">

                <div class="coin-item" v-if="item.coin_name.toLocaleUpperCase() !== 'USDT'">
                    <div class="coin-name">{{item.coin_name}}</div>
                    <input type="number" class="coin-num" v-model="item.proportion">
                </div>
            </template>
            <div class="coin-item">
                <span>剩余可分配比例</span>
                <span class="last-num">{{lastProportion}}</span>
            </div>
            <div class="btns">
                <van-button class="cancel" @click="showSetting = false" size="small">取消</van-button>
                <van-button class="confirm" @click="confirmProportion" :loading="state.confirmLoading"
                    :loadingText="state.confirmLoadingText" size="small">确认</van-button>
            </div>
        </div>
    </van-popup>

</template>

<script lang="ts" setup>
import { useUserInfoStore } from '../../store';
import { CardInfo, CrowdItem } from '../../types/response';
import { Notify } from 'vant';
import Request from '../../utils/request';
type coinProportionItem = {
    coin_name: string,
    proportion: number
}

const userInfo = useUserInfoStore();
const router = useRouter();

const state = reactive({
    cardInfo: {} as CardInfo,
    tabIndex: 0,
    crowdList: [] as CrowdItem[], // 众筹列表
    coinProportionList: [] as coinProportionItem[], // 分配列表
    saveCoinProportionList: [] as coinProportionItem[], // 缓存分配列表
    popup: false,
    coin_num: 0,
    coinToUSDTPrice: 0, // 币种对应USDT价格
    coinLast: 0, // 其他币种余额
    confirmLoading: false,
    getLoading: false,
    confirmLoadingText: '保存中'
})

// 剩余可分配比例
let lastProportion = computed({
    get() {
        return state.saveCoinProportionList.reduce((prev, next) => {
            return prev - next.proportion
        }, 100)
    },
    set() { }
})

const showGetPopup = async () => {
    let result = await Request({
        url: "pledge/coin_info",
        data: {
            address: userInfo.address,
            coin_name: userInfo.coinList[state.tabIndex]['coin_name']
        }
    })
    state.coinToUSDTPrice = result.new_price;
    state.coinLast = result.user_coin;
    state.popup = true;
}

const confirmProportion = async () => {
    state.confirmLoading = true;
    if (lastProportion.value < 0) {
        state.confirmLoading = false;
        Notify({
            type: "danger",
            message: "总分配比例大于100，请重新设置"
        })
        return;
    }

    let coin_set = state.saveCoinProportionList.map(item => {
        return {
            coin_name: item.coin_name,
            proportion: item.proportion / 100
        }
    });
    let result = await Request({
        url: "collect/collect_set",
        data: {
            address: userInfo.address,
            coin_set: JSON.stringify(coin_set)
        },
        method: "post"
    })
    state.confirmLoading = false;
    if (result === '') {
        Notify({
            type: "success",
            message: "设置成功"
        })
        getCrowdList();
        showSetting.value = false;
    }
}

const getCrowdList = async () => {
    let result = await Request({
        url: "collect/collect_list",
        data: {
            address: userInfo.address,
            coin_name: userInfo.coinList[state.tabIndex]['coin_name'],
            num: 100
        }
    })
    state.crowdList = result.list
    state.cardInfo = {
        num1: result.num1,
        num2: result.num2,
        num3: result.num3,
        num4: result.num4,
    };

    state.coinProportionList = result.coin_set.map((item: coinProportionItem) => {
        return {
            coin_name: item.coin_name,
            proportion: item.proportion * 100
        }
    });
    state.saveCoinProportionList = state.coinProportionList;
}

const handleGet = async () => {
    state.getLoading = true;
    let canGet = Number(state.cardInfo.num2);
    let getAmount = Number(state.coin_num);
    let otherNum = state.coin_num / state.coinToUSDTPrice / 2;

    if (canGet === 0) {
        state.getLoading = false;
        Notify({
            type: "danger",
            message: "可提取数量为0，不能领取"
        })
        return;
    }

    if(Number(state.coinLast) < otherNum) {
        state.getLoading = false;
        Notify({
            type: "danger",
            message: userInfo.coinList[state.tabIndex]['coin_name'] + "余额不足，不能领取"
        })
        return;
    }

    if (canGet < getAmount) {
        state.getLoading = false;
        Notify({
            type: "danger",
            message: "可提取数量不足"
        })
        return;
    }

    let result = await Request({
        url: "collect/put_order",
        data: {
            coin_num: state.coin_num,
            address: userInfo.address,
            coin: userInfo.coinList[state.tabIndex]['coin_name']
        },
        method: "POST"
    })
    state.getLoading = false;
    state.popup = false
    if (result === "") {
        Notify({
            type: 'success',
            message: "领取成功"
        })
    }
}

watch(() => state.tabIndex, () => {
    getCrowdList()
}, {
    immediate: true
})


// 显示设置分配比例弹框
const showSetting = ref(false)
const activeItemClick = (index: number) => {
    router.push({
        path: '/crowdFundingDetail',
        query: state.crowdList[index]
    })
}

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.content {
    max-height: 100%;
    display: flex;
    flex-direction: column;
    .header {
        padding: 2rem 1rem 1rem;
        background-color: white;

        .set {
            margin-top: 1rem;
            font-size: 1.4rem;
            display: flex;
            justify-content: space-between;
            background-color: white;
        }


        :deep(.van-tabs__nav--card) {
            margin: 0;
            background-color: white;
        }

        .card {
            .title {
                color: white;
                font-size: 1.4rem;
                margin-bottom: 1rem;
            }

            .value {
                color: white;
                font-size: 1.4rem;
                display: flex;
                align-items: center;
            }

            .get-money {
                margin-left: .6rem;
                color: white;
                background-color: @theme-color;
                border: none;
                border-radius: .4rem;
            }

            .van-row {
                height: 100%;
            }

            .van-col {
                height: 30%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding-left: 1rem;
            }
        }
    }

    .other {
        flex: 1;
        overflow: auto;
    }

    :deep(.get-money-popup) {
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

        .last-money {
            margin-top: 1rem;
            color: @tip-text-color;
            font-size: 1.2rem;
            align-self: flex-start;
            display: flex;
            justify-content: space-between;
        }
    }

}

.pop-content {
    width: 70vw;
    padding: 3rem 2rem 2rem;
    box-sizing: border-box;

    .title {
        font-size: 1.6rem;
        font-weight: bold;
        text-align: center;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid @border-color;
    }

    .coin-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        .coin-name {
            font-size: 1.4rem;
            font-weight: 500;
            color: @theme-color;
        }

        .coin-num {
            width: 3rem;
            padding: .6rem;
            border-radius: .4rem;
            border: 1px solid @border-color;
            font-size: 1.4rem;
        }

        .last-num {
            color: @theme-color;
        }
    }

    .btns {
        display: flex;

        .van-button {
            flex: 1;
            font-size: 1.4rem;
            font-weight: bold;
            border-radius: .4rem;
        }

        .cancel {
            margin-right: 2rem;
        }

        .confirm {
            background-color: @theme-color;
            color: white;
        }
    }
}
</style>