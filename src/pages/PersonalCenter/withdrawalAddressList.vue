<template>
    <!-- 提币地址 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">提币地址</p>
        <div class="content">
            <van-empty image-size="10rem" v-if="state.addressList.length === 0" description="暂无地址" />
            <template v-else>
                <van-swipe-cell v-for="(item, index) in state.addressList" :key="index">
                    <van-cell>

                        <p class="address-text">{{item.text || "12"}}</p>
                        <p class="address-address">{{item.to_address}}</p>
                    </van-cell>

                    <template #right>
                        <van-button square type="danger" class="dag-btn" text="删除" @click="delAddress(item.id)"></van-button>
                    </template>
                </van-swipe-cell>

            </template>
        </div>
        <van-button @click="toAdd" class="add-address-btn">添加地址</van-button>
        <van-popup v-model:show="state.popup" class="del-address-popup">
            <van-field v-model="state.pay_pwd" type="password" placeholder="请输入交易密码进行确认" />
            <van-button @click="handleDel" class="del-btn" size="small">确认删除</van-button>
        </van-popup>
    </div>
</template>

<script lang="ts" setup>
import Request from '../../utils/request';
import { AddressItem } from './../../types/response'
import { useUserInfoStore } from '../../store';
import { Notify } from 'vant';

const userInfo = useUserInfoStore()
const router = useRouter();

const navBack = () => {
    router.back()
}
const state = reactive({
    addressList: [] as AddressItem[],
    popup: false,
    pay_pwd: '',
    delId: 0
})

onMounted(() => getAddressList());

const getAddressList = async () => {
    let result = await Request({
        url: 'user/to_address_list',
        data: {
            address: userInfo.$state.address
        }
    })
    state.addressList = result;
}

const delAddress = (id: number) => {
    state.delId = id
    state.popup = true;
}

const handleDel = async () => {
    if(!state.pay_pwd) {
        Notify({ type: "danger", message: "请输入交易密码" });
        return;
    }
    let result = await Request({
        url: "user/del_to_address",
        data: {
            address: userInfo.$state.address,
            id: state.delId,
            pay_pwd: state.pay_pwd
        },
        method: "post"
    })
    if(result === 1) {
        Notify({ type: "success", message: "删除成功", onOpened: () => {
            getAddressList();
            state.popup = false;
            state.pay_pwd = "";
            state.delId = 0;
        } });
    }
}

const toAdd = () => {
    router.push('/withdrawalAddress')
}

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.page-main {
    padding: 0 2rem 2rem;
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
    .dag-btn{
        height: 100%;
    }

    .content {
        flex: 1;
        overflow-y: auto;
    }

    .add-address-btn {
        background-color: @theme-color;
        color: white;
    }

    :deep(.del-address-popup) {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem 3rem;
        border-radius: .6rem;
        width: 80vw;
        box-sizing: border-box;

        .del-btn {
            margin-top: 2rem;
            background-color: @theme-color;
            color: white;
            width: 60%;
            border-radius: .6rem;
        }
    }


    .address-text {
        font-size: 1.4rem;
        font-weight: 500;
    }

    .address-address {
        font-size: 1.2rem;
        color: #666;
    }
}
</style>    