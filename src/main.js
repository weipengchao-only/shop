import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
//添加设置请求拦截器，为请求头（config.headers）中的Authorization属性设置token值，确定访问权限
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config;
})
Vue.prototype.$http = axios//把包挂载到vue的原型对象上
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
