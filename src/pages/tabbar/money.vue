<template>
    <!-- 资产 -->
    <div class="money-content">
        <div class="header">
            <div class="money">
                <p class="title">总账户资产折合（USDT）</p>
                <div class="exchange-content">
                    <p class="money-u">{{state.info.sum_usdt}} </p>
                    <p class="money-c">&nbsp;≈ {{state.info.sum_cny}}CNY</p>
                </div>
                <div class="btns">
                    <van-button size="small" @click="toRecharge" class="recharge">充币</van-button>
                    <van-button size="small" @click="toWithdrawal">提币</van-button>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="content-header">
                <p class="all" @click="seeFlowingWaterList">
                    <van-icon size="1.4rem" name="balance-list-o" />
                    账户流水
                </p>
            </div>
            <div class="list">
                <div class="list-item" @click="seeCoinList(item)" v-for="(item, index) in state.info.coin_list" :key="index">
                    <p class="name">{{ item.coin_name }}</p>
                    <div class="item-group">
                        <div>
                            <p>可用</p>
                            <span>{{ item.coin_num }}</span>
                        </div>
                        <div>
                            <p>锁定</p>
                            <span>{{ item.coin_lock }}</span>
                        </div>
                        <div>
                            <p>折合(CNY)</p>
                            <span>{{ item.coin_cny }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Request from '../../utils/request';
import { useUserInfoStore } from '../../store';


type coinItem = {
    coin_name: string,
    coin_num: string,
    coin_lock: string,
    coin_usdt: string,
    coin_cny: string
}
type moneyInfo = {
    sum_usdt: string,
    sum_cny: string,
    coin_list: coinItem[]
}

const userInfo = useUserInfoStore();
const router = useRouter();


const state = reactive({
    info: {} as moneyInfo
})

onMounted(() => getMoneyInfo());

// 获取资产信息
const getMoneyInfo = async () => {
    let result = await Request({
        url: "user/my_wallet",
        data: {
            address: userInfo.address
        }
    })
    userInfo.$state.from_address = result.get_address
    state.info = result;
}

const toWithdrawal = () => {
    router.push('/withdrawal')
}
const toRecharge = () => router.push('/recharge');
const seeCoinList = (item: coinItem) => {
    router.push({
        path: "/flowingWater",
        query: {
            coin: item.coin_name,
            title: item.coin_name + '流水',
        }
    })
}
const seeFlowingWaterList = () => router.push('/flowingWater')
</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.money-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: @page-bg-color;
    overflow: hidden;

    .header {
        padding: 3rem 2rem 0;
        background-color: white;
        display: flex;
        flex-direction: column;

        .money {
            box-sizing: border-box;

            .title {
                color: @tip-text-color;
                margin-bottom: 1rem;
            }

            .exchange-content {
                display: flex;
                align-items: flex-end;
                margin-bottom: 2rem;

                .money-u {
                    font-size: 2rem;
                }

                .money-c {
                    font-size: 1rem;
                    color: @tip-text-color;
                }
            }

            .btns {
                display: flex;
                justify-content: space-between;
                margin-bottom: 1rem;

                .van-button {
                    width: 30%;
                    background-color: @tip-color;
                    border: none;
                }

                .recharge {
                    background-color: @theme-color;
                    color: white;
                }
            }

            .van-tabs {
                border-bottom: 1px solid @border-color;
            }

            .wallet-content {
                padding-top: 2rem;

                .money-c {
                    color: #333;
                }
            }
        }
    }

    .content {
        flex: 1;
        margin-top: 1rem;
        background-color: white;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .content-header {
            display: flex;
            justify-content: space-between;
            padding: 1rem;
            align-items: center;

            .all {
                font-size: 1.2rem;
                color: @tip-text-color;
            }
        }

        .list {
            flex: 1;
            overflow: auto;

            .list-item {
                padding: 1rem 2rem;
                border-top: 1px solid @border-color;

                .name {
                    font-size: 1.6rem;
                    font-weight: 700;
                    margin-bottom: 1.5rem;
                }

                .item-group {
                    display: flex;

                    div {
                        flex: 1;
                    }

                    p {
                        font-size: 1rem;
                        color: @tip-text-color;
                        margin-bottom: 1rem;
                    }

                    span {
                        font-size: 1rem;
                        color: #333;
                    }
                }
            }
        }
    }
}
</style>