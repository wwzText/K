<template>
    <van-space class="active-item-conetnt" fill direction="vertical" size="1rem" @click="activeClick">
        <van-row justify="space-between">
            <van-col>
                <span class="title">{{item.name}}</span>
            </van-col>
            <van-col>
                <van-tag>{{E_status[item.status]}}</van-tag>
            </van-col>
        </van-row>
        <van-row justify="space-between">
            <van-col>
                <span :style="{fontSize: '1.4rem'}">收益</span>
            </van-col>
            <van-col>
                <span :style="{fontSize: '1.4rem'}">{{item.profit * 100}}%</span>
            </van-col>
        </van-row>
        <van-row justify="space-between">
            <van-col>
                <span :style="{fontSize: '1.4rem'}">活动时间</span>
            </van-col>
            <van-col>
                <span :style="{fontSize: '1.4rem'}">{{formatTime(item.start_time)}}至{{formatTime(item.end_time)}}</span>
            </van-col>
        </van-row>
        <van-progress color="#FBB400" :percentage="item.yj * 100" />
        <div class="num-item" :align="'end'">众筹数量：<span class="num">{{item.d_num}}</span>USDT</div>
        <div class="num-item" :align="'end'">已投数量：<span class="num">{{item.y_num}}</span>USDT</div>
    </van-space>
</template>

<script lang="ts" setup>
import { CrowdItem } from './../types/response';
import { formatTime } from './../utils/index';

type Props = {
    item: CrowdItem
}
enum E_status {
    "未开始" = 1,
    "进行中" = 2,
    "正常结束" = 3,
    "爆仓" = 4
}
const props = defineProps<Props>();

const emits = defineEmits(['click'])

const activeClick = () => {
    emits('click')
}

</script>

<style scoped lang="less">
.active-item-conetnt {
    display: flex;
    flex-direction: column;
    background-color: white;
    padding: 2rem 1rem;
    box-sizing: border-box;
    margin: 1rem .5rem;
    border-radius: .8rem;
}

.title{
    font-size: 1.6rem;
    font-weight: 700;
}
.num{
    font-size: 1.6rem;
    font-weight: 700;
}
.num-item{
    margin: 0 auto;
    text-align: center;
}
</style>