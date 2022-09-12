<template>
    <!-- 帮助中心 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">{{state.info.title}}</p>
        <p class="time">创建时间：{{state.info.add_time}}</p>
        <div class="content">
            <p v-html="state.info.content"></p>
        </div>
        
    </div>
</template> 

<script lang="ts" setup>
import Request from '../utils/request';
import { ArticleItem } from './../types/response';
import { formatTime } from '../utils/index';
const route = useRoute();
const router = useRouter();

const state = reactive({
    info: {} as ArticleItem
})
let info = reactive({} as ArticleItem)

const getDetail = async () => {
    let result = await Request({
        url: "index/website_notice_info",
        data: route.query
    })
    result.add_time = formatTime(result.add_time, 'YYYY-MM-DD hh:mm')
    state.info = result
}
onMounted(() => {
    getDetail()
})

const navBack = () => router.back();

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');
.page-main {
    padding: 0 2rem 2rem;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    flex-direction: column;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }

    .time{
        margin: 1rem 0;
        font-size: 1.4rem;
        color: #666;
    }
    .content{
        flex:  1;
        overflow-y: auto;
    }
}
</style>