

export type CoinItem = {
    coin_name: string,
    contract_address: string | null,
    img: string
}

// 公告
export type ArticleItem = {
    thumb?: string,
    article_id: number,
    title: string,
    content: string,
    add_time: string
}
// 首页卡片信息
export type CardInfo = {
    num1: string,
    num2: string,
    num3: string,
    num4: string,
    num5?: string,
    num6?: string,
}

export type AddressItem = {
    to_address: string,
    id: number,
    text: string
}

// 交易页面，币币类型
export type bibiCoinItem = {
    new_price: string,
    coin_name: string,
    usdt_cny: string,
    p: string
}

export type bibiCoinDetail = {
    sum_num: number,
    b_url: string, // 白皮书
    clos_price: string, // 收盘价
    coin_cny: string,
    coin_name: string,
    d_num: string,
    g_url: string,
    is_c: number,
    l_num: string,
    max_price: string,
    min_price: string,
    new_price: string,
    p: string,
    time: string,
    usdt_cny: string,
    user_coin: string,
    user_usdt_coin: string,
    z_price: string,
    teef: number,
    /**
     * @param { string } coin_name 币种名称
     */
    coin_name: string
}

export type sonItem = {
    num1?: string,
    num2?: string,
    put_user: number,
    eth_address: string,
    total_team: number,
    total_ore: number,
    put_user_all: number,
    son: sonItem[]
}

export type CrowdItem = {
    /**
     * 众筹活动名称
     */
    name: string,
    status: number,
    profit: number,
    start_time: number,
    end_time: number,
    d_num: number,
    y_num: number,
    coin_name: string, // 币种名称
    yj: number,
    user_coin: number
}

declare module 'echarts' {
    const echarts: any
    export default echarts
}