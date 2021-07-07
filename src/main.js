import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios//把包挂载到vue的原型对象上
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
