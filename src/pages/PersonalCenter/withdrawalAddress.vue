<template>
    <!-- 添加提币地址 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">添加提币地址</p>
        <LabelInput label="地址" v-model="state.to_address" placeholder="请输入提币地址" />
        <LabelInput label="备注" v-model="state.text" placeholder="请输入备注" />
        <LabelInput label="交易密码" type="password" v-model="state.pay_pwd" placeholder="请输入交易密码" />
        
        <van-button class="submit-btn" @click="submit" :loading="state.submitIng" loading-text="正在添加">立即添加</van-button>
    </div>
</template>

<script lang="ts" setup>
import { useUserInfoStore } from '../../store';
import Request from '../../utils/request';
import { Notify } from 'vant';
import web3 from "web3";
const userInfo = useUserInfoStore();
const router = useRouter();
const state = reactive({
    submitIng: false,
    to_address: '',
    pay_pwd: '',
    text: ''
})
const navBack = () => {
    router.back()
}

const submit = async () => {
    if(!web3.utils.isAddress(state.to_address)) {
        Notify({type: 'danger', message: '请输入正确的钱包地址'});
        return;
    }
    if(!state.to_address) {
        Notify({type: 'danger', message: '请输入提币地址'});
        return;
    }
    if(!state.pay_pwd) {
        Notify({type: 'danger', message: '请输入交易密码'});
        return;
    }
    state.submitIng = true;

    let result = await Request({
        url: 'user/add_to_address',
        method: 'post',
        data: {
            address: userInfo.$state.address,
            to_address: state.to_address,
            pay_pwd: state.pay_pwd,
            text: state.text
        }
    })
    state.submitIng = false;
    if(result === null) {
        Notify({type: 'success', message: '添加成功', onOpened:() => navBack() });
    }
}

</script>

<style scoped lang="less">
@import url('@/assets/css/base.less');

.page-main {
    padding: 0 2rem;
    background-color: white;
    box-sizing: border-box;

    .title {
        font-size: 1.8rem;
        font-weight: 500;
        border-bottom: 1px solid @border-color;
        padding-bottom: 2rem;
    }

    .submit-btn {
        background-color: @theme-color;
        color: white;
        width: 100%;
        margin-top: 5rem;
    }
}
</style>