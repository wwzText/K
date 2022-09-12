<template>
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">{{route.query.title || '交易记录'}}</p>
        <van-list class="content" v-if="state.list.length">
            <div class="item" v-for="(item, index) in state.list" :key="index">
                <div class="row">
                    <span class="name">{{item.coin}}</span>
                    <span>{{item.add_time}}</span>
                </div>
                <div class="row">
                    <span>{{item.remark}}</span>
                    <span :class="Number(item.reat) === 1 ? 'add-money' : 'dec-money'">
                        {{Number(item.reat) === 1 ? '+' : '-'}}
                        {{item.price}}
                    </span>
                </div>
            </div>
        </van-list>
        <van-empty v-else description="暂无记录"></van-empty>
    </div>

</template>

<script lang="ts" setup>
import Request from '../utils/request';
import { useUserInfoStore } from '../store';
import { formatTime } from './../utils/index';
const router = useRouter();
const route = useRoute();
enum E_status {
    "失败",
    "成功",
    "正在执行",
    "待审核",
    "异常",
    "提现拒绝"
}

type flowingWaterItem = {
    record_id: string,
    coin: string,
    price: string,
    reat: string | number,
    add_time: string,
    status: string,
    remark: string,
    to_address?: string,
}

const userInfo = useUserInfoStore();

const state = reactive({
    list: [] as flowingWaterItem[],

})

const navBack = () => router.back()

const getFlowingWaterList = async () => {
    let obj = { ...route.query };
    delete obj.title
    let result = await Request({
        url: "user/my_log",
        data: {
            address: userInfo.address,
            ...obj
        }
    })
    if (result) {
        state.list = result.map((item: flowingWaterItem) => {
            return {
                ...item,
                add_time: formatTime(item.add_time),
            }
        });
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
}

.name {
    font-weight: 700;
}

.add-money {
    color: @up-color;
}

.dec-money {
    color: @down-color;
}
</style>