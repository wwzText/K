import { CoinItem } from './../types/response';

export const useTabbarStore = defineStore('tabbarStore', {
    state: () => {
        return {
            // 0首页/1交易/2众筹/3资产
            tabbarActive: 0, // 当前tabbar下标，只有0 - 3，其他页面使用不同的值
        }
    }
})

// 0xF6714dC66BC55F982a37CAef16e371C12c242480

export const useUserInfoStore = defineStore('userInfoStore', {
    state: () => {
        return {
            address: "", // 地址
            user_level: 0, // 等级
            usdt_coin: 0, // usdt 余额
            first_address: "", // 推荐人地址
            from_address: "", // 收钱地址
            user_sn: "",
            web_url: "",
            coinList: [] as CoinItem[],
            loading: true,
        }
    },
    getters: {
        hideAddress: (state) => state.address
    }
})