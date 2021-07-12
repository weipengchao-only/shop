import Vue from 'vue'
import { 
	Button, 
	Form, 
	FormItem, 
	Input, 
	Message, 
	Container, 
	Header, 
	Aside, 
	Main, 
	Menu,
	Submenu,
	MenuItemGroup,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	pagination,
	Dialog,
	MessageBox
	
	
	} from 'element-ui'

// import { Message } from 'element-ui'//导入弹框提示组件

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(pagination)
Vue.use(Dialog)
Vue.prototype.$message = Message //把message组件挂载到vue的原型对象上，这样每个组件都可以通过this访问到$message,以此使用Message组件
Vue.prototype.$confirm = MessageBox.confirm