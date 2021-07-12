import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'



import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
//添加设置请求拦截器，为请求头（config.headers）中的Authorization属性设置token值，确定访问权限
axios.interceptors.request.use(config => {
	config.headers.Authorization = window.sessionStorage.getItem('token')
	return config;
})
Vue.prototype.$http = axios//把包挂载到vue的原型对象上
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
