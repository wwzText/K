<template>
    <!-- 帮助中心 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">帮助中心</p>
        <div v-for="(item, index) in state.articleList" :key="index">
            <p class="s-title">{{item.cat_name}}</p>
            <van-collapse v-model="activeName1">
                <van-collapse-item v-for="(value, i) in item.article_lists" :key="i" :title="value.title" :name="value.article_id">
                    {{value.content}}
                </van-collapse-item>
            </van-collapse>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Request from '../../utils/request';
const router = useRouter();

const navBack = () => {
    router.back()
}
const state = reactive({
    articleList: [] as any[]
})

onMounted(() => getArticle())

const getArticle = async () => {
    state.articleList = await Request({
        url: "index/get_help_article",
    })
}

const activeName1 = ref([])

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

    .s-title {
        font-size: 1.4rem;
        font-weight: 500;
        padding: 1rem 0;
        margin-top: 2rem;
    }
}
</style>    