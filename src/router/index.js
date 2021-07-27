import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login.vue'
import '../assets/css/global.css'
import Home from '../components/home.vue'
import Welcom from '../components/welcom.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/rights.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/params.vue'
import List from '../components/goods/List.vue'
import Add from '../components/goods/Adds.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)

const routes = [
	{path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
		path:'/home',
		component:Home,
		redirect:'/welcom',
		children:[
		{path:'/welcom',component:Welcom},
		{path:'/users',component:Users},
		{path:'/rights',component:Rights},
		{path:'/roles',component:Roles},
		{path:'/categories',component:Cate},
		{path:'/params',component:Params},
		{path:'/goods',component:List},
		{path:'/goods/add',component:Add},
		{path:'/orders',component:Order}
		
	]}
	
  
]

const router = new VueRouter({
  routes
})
//加入路由守卫
router.beforeEach((to,from,next)=>{
	//to表示将要访问的路径，form代表从哪个路径跳转过来，next() 表示放行 next('路径')表示要跳转的路径
	if(to.path === '/login') return next();
	const tokenValue = window.sessionStorage.getItem('token')
	if(!tokenValue) return next('/login');
	next()
})

export default router
