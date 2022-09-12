import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
    {
        path: "/",
        component: () => import('@/pages/index.vue')
    }, {
        path: "/userInfo",
        component: () => import('@/pages/userInfo.vue')
    }, {
        path: '/withdrawal',
        component: () => import('@/pages/withdrawal.vue')
    }, {
        path: '/recharge',
        component: () => import('@/pages/recharge.vue')
    }, {
        path: "/crowdFundingDetail", // 众筹详情
        component: () => import('@/pages/crowdFundingDetail.vue')
    }, {
        path: "/interests", // 用户权益
        component: () => import('@/pages/PersonalCenter/interests.vue')
    }, {
        path: "/security", // 安全中心
        component: () => import('@/pages/PersonalCenter/security.vue')
    }, {
        path: "/setPwd", // 设置密码
        component: () => import('@/pages/PersonalCenter/setPwd.vue')
    }, {
        path: "/invite", // 邀请好友
        component: () => import('@/pages/PersonalCenter/invite.vue')
    }, {
        path: "/withdrawalAddressList", // 提币地址
        component: () => import('@/pages/PersonalCenter/withdrawalAddressList.vue')
    }, {
        path: "/withdrawalAddress", // 提币地址
        component: () => import('@/pages/PersonalCenter/withdrawalAddress.vue')
    }, {
        path: "/help", // 提币地址
        component: () => import('@/pages/PersonalCenter/help.vue')
    }, {
        path: "/contactUs", // 提币地址
        component: () => import('@/pages/PersonalCenter/contactUs.vue')
    }, {
        path: "/setRecommender", // 设置推荐人
        component: () => import('@/pages/PersonalCenter/setRecommender.vue')
    }, {
        path: "/flowingWater",
        component: () => import('@/pages/flowingWater.vue')
    }, {
        path: "/articleDetail",
        component: () => import("@/pages/articleDetail.vue")
    }, {
        path: "/k",
        component: () => import('@/pages/k.vue')
    }, {
        path: "/orderList",
        component: () => import('@/pages/orderList.vue')
    }, {
        path: "/articleList",
        component: () => import('@/pages/articleList.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router