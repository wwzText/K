<!-- 身份权益 -->
<template>
    <Header @back="navBack" ghost>
        <span class="page-title">身份权益</span>
        <span :style="{ padding: '0 2rem' }"></span>
    </Header>
    <div class="page-main">
        <div class="header">
            <p class="title">我的团队</p>
        </div>
        <div class="invitation-info">
            <div class="invitation-info-item">
                <span class="title">用户等级</span>
                <span class="value">{{userInfo.user_level === 1 ? '普通用户' : 'vip' + (Number(userInfo.user_level) - 1)}}</span>
            </div>
            <div class="invitation-info-item">
                <span class="title">邀请奖励</span>
                <span class="value">{{state.info.num1}}</span>
            </div>
            <div class="invitation-info-item">
                <span class="title">节点奖励</span>
                <span class="value">{{state.info.num2}}</span>
            </div>
        </div>
        <div class="invitation-list">
            <div class="invitation-header">
                <p class="header-content">邀请列表</p>
            </div>
            <div class="list-content">
                <template v-if="state.info?.son?.length">
                    <div class="list-item" v-for="(item, index) in state.info.son" :key="index">
                        <p class="uid">Addr：{{hiddenAddress(item.eth_address)}}</p>
                        <div class="item_item">
                            <div>
                                <p class="num">{{item.total_ore}}</p>
                                <p>个人业绩</p>
                            </div>
                            <div>
                                <p class="num">{{item.total_team}}</p>
                                <p>团队业绩</p>
                            </div>
                            <div>
                                <p class="num">{{item.put_user_all}}</p>
                                <p>团队人数</p>
                            </div>
                        </div>
                    </div>
                </template>
                <van-empty image-size="10rem" v-else description="暂无邀请" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Request from '../../utils/request';
import { useUserInfoStore } from '../../store';
import { sonItem } from './../../types/response';
import { hiddenAddress } from '../../utils';
const userInfo = useUserInfoStore();
const router = useRouter();
const navBack = () => {
    router.back()
}
const state = reactive({
    info: {} as sonItem
})

onMounted(() => getInfo());

const getInfo = async () => {
    state.info = await Request({
        url: "user/my_s",
        data: {
            address: userInfo.$state.address
        }
    })
}

</script>

<style scoped lang="less">
@import url('./../../assets/css/base.less');

.page-title {
    font-size: 1.6rem;
    color: white;
}

.page-main {
    position: fixed;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: white;
    padding: 0;
    display: flex;
    flex-direction: column;

    .header {
        height: 30vh;
        background: linear-gradient(#ffdfad, #e0a84f);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;

        &::after {
            content: "";
            width: 50vw;
            height: 80%;
            position: absolute;
            right: 0;
            background-image: url('./../../assets/img/bg-idRight.2d6fff59.png');
            background-size: 100% 100%;
        }

        .title {
            text-align: center;
            color: #633F0C;
            font-size: 1.8rem;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                width: 50%;
                left: 25%;
                bottom: -1rem;
                height: .4rem;
                border-radius: .2rem;
                background-color: #633F0C;
            }
        }
    }

    .invitation-info {
        height: 25vh;
        margin: -10vh 3rem;
        box-sizing: border-box;
        background-image: url('./../../assets/img/info-bg.png');
        background-position: 5%;
        background-size: 150% 120%;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        z-index: 999;

        .invitation-info-item {
            display: flex;
            font-size: 1.4rem;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                left: 1.5rem;
                top: .7rem;
                width: 4px;
                height: 4px;
                background-color: #633F0C;
                border-radius: 2px;
            }

            .title {
                color: #633F0C;
                margin-right: 3rem;
                margin-left: 3rem;
            }

            .value {
                color: #633F0C;
                font-weight: 500;
            }
        }

    }

    .invitation-list {
        flex: 1;
        margin: 12vh 3rem 0;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        // box-shadow: 1rem 1rem @border-color;
        .invitation-header {
            background-color: @tip-color;
            height: 4rem;
            display: flex;
            align-items: center;

            .header-content {
                position: relative;
                font-size: 1.4rem;
                font-weight: 500;
                background-color: white;
                height: 100%;
                line-height: 4rem;
                padding: 0 2rem;

                &::after {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    width: 30%;
                    left: 35%;
                    height: 4px;
                    border-radius: 2px;
                    background-color: @theme-color;
                }
            }

        }

        .list-content {
            flex: 1;
            overflow: auto;

            .list-item {
                padding: 1rem 3rem;

                .uid {
                    font-size: 1.4rem;
                }

                .item_item {
                    display: flex;
                    justify-content: space-between;
                    text-align: center;
                    font-size: 1rem;
                    color: @tip-text-color;
                    border-bottom: 1px solid @border-color;
                    padding-bottom: 1rem;

                    .num {
                        font-size: 1.2rem;
                        font-weight: 500;
                        color: #333;
                        margin: 1rem 0;
                    }
                }
            }
        }
    }
}
</style>