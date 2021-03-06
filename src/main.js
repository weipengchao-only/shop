import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

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

Vue.component('tree-table', TreeTable)
//将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)
//时间过滤器，将毫秒值过滤成年月日分秒时
Vue.filter('dateFormat',function(originVal){
	const dt = new Date(originVal)
	
	const y = dt.getFullYear()
	const m = (dt.getMonth() + 1 + '').padStart(2,'0')
	const d = (dt.getDate() + '').padStart(2,'0')
	const h = (dt.getHours() + '').padStart(2,'0')
	const mm = (dt.getMinutes() + '').padStart(2,'0')
	const ss = (dt.getSeconds() + '').padStart(2,'0')
	
	return `${y}-${m}-${d} ${h}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
