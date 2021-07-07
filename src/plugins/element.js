import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// import { Message } from 'element-ui'//导入弹框提示组件

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message //把message组件挂载到vue的原型对象上，这样每个组件都可以通过this访问到$message,以此使用Message组件