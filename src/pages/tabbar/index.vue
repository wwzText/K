<template>
    <div>

        <!-- 用户地址 -->
        <van-row justify="space-between" class="header">
            <van-col span="8">
                <van-space @click="toUserInfo">
                    <van-icon color="rgb(97, 143, 243)" name="manager" size="2rem" />
                    <p class="address">HI !{{userInfoStore.$state.address}}</p>
                </van-space>
            </van-col>
            <van-col>
                <van-icon color="#c0c0c0" @click="router.push('/articleList')" name="bell" size="2rem" />
            </van-col>
        </van-row>
        <!-- 轮播 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item @click="clickBanner(index)" v-for="(item, index) in Data.bannerList">
                <img :src="item.thumb" alt="">
            </van-swipe-item>
        </van-swipe>
        <!-- 公告 -->
        <van-notice-bar left-icon="volume-o" :scrollable="false" background="white" color="black">
            <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
                <van-swipe-item @click="noticeClick(index)" v-for="(item, index) in Data.articleList" :key="index">
                    {{item.title}}</van-swipe-item>
            </van-swipe>
        </van-notice-bar>
        <van-grid :border="false" :column-num="3" :style="{borderRadius: '1rem', margin: '0 1rem 1rem'}">
            <van-grid-item @click="router.push('/invite')">
                <img :style="{width: '3rem', height: '3rem', marginBottom: '.8rem'}"
                    src="./../../assets/img/liwu.png" />
                <span>邀请返佣</span>
            </van-grid-item>
            <van-grid-item @click="router.push('/recharge')">
                <img :style="{width: '3rem', height: '3rem', marginBottom: '.8rem'}"
                    src="./../../assets/img/chongz.png" />
                <span>充值</span>
            </van-grid-item>
            <van-grid-item @click="router.push('/help')">
                <img :style="{width: '3rem', height: '3rem', marginBottom: '.8rem'}"
                    src="./../../assets/img/help.png" />
                <span>帮助中心</span>
            </van-grid-item>
        </van-grid>
        <!-- icons -->
        <van-tabs v-model:active="tabIndex" type="card" title-active-color="white" swipeable
            title-inactive-color="#FBB400" color="#FBB400">
            <template v-for="(item, index) in Data.coinList" :key="index">
                <van-tab :title="item.coin_name" v-if="item.coin_name.toLocaleUpperCase() !== 'USDT'">
                    <Card class="card">
                        <van-row wrap justify="space-between">
                            <van-col :span="12">
                                <p class="title">当前流通量</p>
                                <p class="value">{{Data.cardInfo.num1}}</p>
                            </van-col>
                            <van-col :span="12">
                                <p class="title">销毁总量</p>
                                <p class="value">{{Data.cardInfo.num4}}</p>
                            </van-col>
                            <van-col :span="12">
                                <p class="title">储存爆块产出总量</p>
                                <p class="value">{{Data.cardInfo.num2}}</p>
                            </van-col>
                            <van-col :span="12">
                                <p class="title">爆仓爆块产出总量</p>
                                <p class="value">{{Data.cardInfo.num5}}</p>
                            </van-col>
                            <van-col :span="12">
                                <p class="title">储存爆块待产出总量</p>
                                <p class="value">{{Data.cardInfo.num3}}</p>
                            </van-col>
                            <van-col :span="12">
                                <p class="title">爆仓爆块待产出总量</p>
                                <p class="value">{{Data.cardInfo.num6}}</p>
                            </van-col>
                        </van-row>
                    </Card>
                </van-tab>
            </template>

        </van-tabs>

        <!-- 查看权益 -->
        <Info :style="{marginTop: '1rem'}" title="身份权益" btnText="查看权益" @click="seeInterests" />
        <img class="bg-img" src="./../../assets/img/detail-bg.png" alt="">
    </div>
</template>

<script lang="ts" setup>
import Request from './../../utils/request';
import { useUserInfoStore } from './../../store';
import { CoinItem, ArticleItem, CardInfo } from './../../types/response'
const router = useRouter();
const route = useRoute();
const tabIndex = ref(0);
// 钱包信息
const userInfoStore = useUserInfoStore();

const Data = reactive({
    coinList: [] as CoinItem[], // 币种列表
    bannerList: [] as ArticleItem[], // banner列表
    articleList: [] as ArticleItem[], // 公告列表
    cardInfo: {} as CardInfo
})

onMounted(() => {
    checkRegister(userInfoStore.address);
    getArticleList();
    getBannerList();
})



const getBannerList = async () => {
    let result = await Request({
        url: "index/website_notice_lists",
        data: {
            cat_id: 10
        }
    })
    Data.bannerList = result.map((item: ArticleItem) => {
        return {
            ...item,
            thumb: `https://api.gbcblock.com${item.thumb}`
        }
    })
}
const getArticleList = async () => {
    Data.articleList = await Request({
        url: "index/website_notice_lists",
        data: {
            cat_id: 3
        }
    })
}

// 获取到用户地址后立即验证注册
// 验证注册后获取币种列表
// 根据币种列表获取币种信息
watch(() => userInfoStore.address, val => {
    checkRegister(val)
});

watch(() => tabIndex.value, (val) => {
    getIndexInfo(val)
})

const getUserSn = () => {
    let href = window.location.href;
    let query = href.split('?')[1];
    let user_sn = '';
    query && query.split('&').forEach(item => {
        let queryItem: string[] = item.split('=');
        if (queryItem[0] === 'user_sn') {
            user_sn = queryItem[1].replace('#/', '')
        }
    })
    return user_sn;
}

// 验证注册信息 
const checkRegister = async (address: string) => {
    if (!address) return;
    await Request({
        data: {
            address,
            user_sn: getUserSn()
        },
        url: "user/app_reg",
        method: "POST"
    })
    getCoinList();
}
/**获取币种列表 */
const getCoinList = async () => {
    let result = await Request({
        url: "pledge/coin_list"
    })
    Data.coinList = result;
    userInfoStore.$state.coinList = result;
    getIndexInfo(0)
}
const clickBanner = (index: number) => {
    router.push({
        path: '/articleDetail',
        query: {
            id: Data.bannerList[index].article_id
        }
    })
}

/**获取首页前置信息 */
const getIndexInfo = async (coinIndex: number) => {
    let result = await Request({
        data: {
            address: userInfoStore.address,
            coin_name: Data.coinList[coinIndex]['coin_name']
        },
        url: "trx/index",
    });
    Data.cardInfo = {
        num1: result.num1,
        num2: result.num2,
        num3: result.num3,
        num4: result.num4,
        num5: result.num5,
        num6: result.num6,
    };
    userInfoStore.$patch({
        user_level: result.user_level,
        usdt_coin: result.usdt_coin,
        first_address: result.first_address,
        user_sn: result.user_sn,
        web_url: result.web_url,
    })
}

const noticeClick = (index: number) => {
    router.push({
        path: '/articleDetail',
        query: {
            id: Data.articleList[index].article_id
        }
    })
}
const toUserInfo = () => {
    router.push('/userInfo')
}
// 查看权益
const seeInterests = () => {
    router.push('/interests')
}

</script>

<style scoped lang="less">
.header {
    padding: 10px 20px;
    box-sizing: border-box;
    background-color: white;
    .address {
        flex: 1;
        width: 10rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 1.6rem;
    }
}

// 轮播
.my-swipe .van-swipe-item {
    color: #fff;
    font-size: 20px;
    line-height: 150px;
    text-align: center;
    background-color: #39a9ed;
    border-radius: 1rem;
    height: 30rem;
}

// 公告
.van-notice-bar {
    margin-top: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;

    .notice-swipe {
        height: 40px;
        line-height: 40px;
    }
}

.card {
    margin: 0 1.5rem;
    width: calc(100% - 3rem);

    .title {
        color: white;
    }

    .value {
        color: white;
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

.bg-img {
    margin: 1rem auto;
    display: block;
    width: 90%;

}
</style>