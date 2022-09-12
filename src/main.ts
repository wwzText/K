import { createApp } from 'vue';
import '@/assets/css/global.css';

import App from './App.vue';
import router from './router/index';

// 公共组件
import Card from '@/components/card.vue';
import Header from '@/components/header.vue';
import Info from '@/components/info.vue';
import ActiveItem from '@/components/activeItem.vue';
import LabelInput from '@/components/labelInput.vue';
import TipContent from '@/components/tipContent.vue';

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()

import 'vant/es/notify/style';

let _app = createApp(App);

// 注入公共组件
_app.component('Card', Card);
_app.component('Header', Header);
_app.component('Info', Info);
_app.component('ActiveItem', ActiveItem);
_app.component('LabelInput', LabelInput);
_app.component('TipContent', TipContent)

_app.use(createPinia()); // 注入 store 管理工具
_app.use(router); // 注入路由

_app.mount('#app'); // 执行挂载
