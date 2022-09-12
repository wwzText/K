<template>
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">公告列表</p>
        <div class="content" v-if="state.articleList.length">
            <van-cell class="item" @click="toDetail(index)" v-for="(item, index) in state.articleList" :key="index">
                <h3>{{item.title}}</h3>
                <span>{{item.add_time}}</span>
            </van-cell>
        </div>
        <van-empty v-else description="暂无记录"></van-empty>
    </div>

</template>

<script lang="ts" setup>
import Request from '../utils/request';
import { useUserInfoStore } from '../store';
import { formatTime } from './../utils/index';
import { ArticleItem } from './../types/response';
const router = useRouter();
const route = useRoute();
enum E_status {
    "进行中" = 1,
    "已完成" = 2,
    "撤回" = 3,
}



const state = reactive({
    articleList: [] as ArticleItem[]
})

const toDetail = (index: number) => {
    router.push({
        path: "/articleDetail",
        query: {
            id: state.articleList[index].article_id
        }
    })
}

const navBack = () => router.back()

const getFlowingWaterList = async () => {
    let list = await Request({
        url: "index/website_notice_lists",
        data: {
            cat_id: 3
        }
    })
    state.articleList = list.map((item: ArticleItem) => {
        return {
            ...item,
            add_time: formatTime(item.add_time)
        }
    })
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