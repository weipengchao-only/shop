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
	MessageBox,
	Tag,
	Tree,
	Select,
	Option,
	Cascader,
	Alert,
	Tabs,
	TabPane,
	Steps,
	Step,
	Checkbox,
	CheckboxGroup,
	Upload,
	Timeline,
	TimelineItem
	
	
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$message = Message //把message组件挂载到vue的原型对象上，这样每个组件都可以通过this访问到$message,以此使用Message组件
Vue.prototype.$confirm = MessageBox.confirm