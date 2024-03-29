import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import "babel-polyfill"
import "url-search-params-polyfill"
import Cookies from 'js-cookie'
import VueCookies from 'vue-cookies'
Vue.use(Antd);
Vue.use(VueCookies);

//引入ztree和jquery
import $ from 'jquery';
import 'ztree'
import 'ztree/css/zTreeStyle/zTreeStyle.css'

Vue.config.productionTip = false;
//组件
Vue.use(Header)
Vue.use(Footer)
//重组件名
Vue.component('Header', Header)
Vue.component('Footer', Footer)
new Vue({
  router,
  store,
  render: h => h(App),
  components: {Header, Footer},
}).$mount('#app');


