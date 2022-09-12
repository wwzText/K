<template>
    <!-- 设置交易密码 -->
    <Header @back="navBack" />
    <div class="page-main">
        <p class="title">设置交易密码</p>
        <LabelInput v-if="type === E_TYPE['change']" label="原始密码" type="password" v-model="old_pay_pwd" placeholder="请输入原始密码" />
        <LabelInput label="交易密码" type="password" v-model="pay_pwd" placeholder="请输入交易密码" />
        <LabelInput label="确认交易密码" type="password" v-model="confirm_pay_pwd" placeholder="请输入提现数量" />
        <van-button class="submit-btn" size="small" @click="submit">提交</van-button>
    </div>
</template>

<script lang="ts" setup>
import Request from '../../utils/request';
import { useUserInfoStore } from '../../store';
import { Notify } from 'vant'
enum E_TYPE {
    /**
     * 设置交易密码
     */
    'set' = '1',
    /**
     * 修改交易密码
     */
    'change' = '2'
}
const userInfo = useUserInfoStore()
const router = useRouter();
const navBack = () => {
    router.back()
}

const old_pay_pwd = ref('');
const pay_pwd = ref('');
const confirm_pay_pwd = ref('');
const type = ref(E_TYPE['set']);


const checkPageType = async () => {
    let result = await Request({
        url: "user/my_wallet",
        data: {
            address: userInfo.address
        }
    });
    type.value = result.pay_pwd_set === 0 ? E_TYPE['set'] : E_TYPE['change']
}

const submit = async () => {
    let data: {
        [param: string]: any
    } = {
        address: userInfo.address,
        pay_pwd: pay_pwd.value,
        confirm_pay_pwd: confirm_pay_pwd.value,
        type: '1'
    }
    
    if (type.value === E_TYPE['change']) {
        if (!old_pay_pwd.value) {
            Notify({ type: 'danger', message: '请输入原始交易密码' });
            return;
        }
        data['old_pay_pwd'] = old_pay_pwd.value;
        data['type'] = 2
    }

    if (pay_pwd.value !== confirm_pay_pwd.value) {
        Notify({ type: 'danger', message: '两次密码不一致' });
        return;
    }

    let result = await Request({
        url: 'user/setPayPwd',
        data,
        method: 'POST'
    })

    if (result === "") {
        Notify({ type: 'success', message: '操作成功', onOpened: () => navBack() });
    }

}

onMounted(checkPageType);


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