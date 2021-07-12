<template>
	
	<el-container class="home-container">
		<!--头部区域-->
	  <el-header>
		  <div class="header-top" style="display: flex;align-items: center;">
		  	<img src="../assets/logo.png" width="50px" height="50px">
			<span style="color: #F8F8F8;font-size: 20px;margin-left: 15px;">后台管理系统</span>
		  </div>
		  <el-button type="info" @click="logout">退出登录</el-button>
	  </el-header>
	  <!--侧边栏主体区域-->
	  <el-container>
		  <!--侧边栏区域-->
	    <el-aside :width="iscollapse ? '64px' : '200px' ">
			<!--侧边栏菜单区域-->
			<div class="toggle" @click="toggle">|||</div>
			 <el-menu
			      background-color="#4b89ac"
			      text-color="#fff"
			      active-text-color="#FFEB4D"
				  :unique-opened="true"
				  :collapse="iscollapse"
				  :collapse-transition="false"
				  router
				  :default-active="activePath"
				  ><!--active-text-color激活后的文本颜色-->
				  <!--collapse-transition是否开启折叠动画-->
				  <!--collapse是否水平折叠收起菜单-->
				  <!--unique-opened是否只保持一个子菜单的展开>
				  <!--router对应的路径就是:index的值-->
				  <!--router为true时使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转-->
				  <!--一级菜单-->
			      <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
			        <template slot="title">
						<!--一级菜单图标-->
			          <i :class="iconsList[item.id]"></i>
					  <!--一级菜单文本-->
			          <span>{{item.authName}}</span>
			        </template>
					
					<!--二级菜单-->
			        <el-menu-item @click="saveIndex('/'+subItem.path)" v-for="subItem in item.children" :key="subItem.id" :index=" '/'+subItem.path">
						<template slot="title">
							<!--二级菜单图标-->
						  <i class="el-icon-menu"></i>
						  <!--二级菜单文本-->
						  <span>{{subItem.authName}}</span>
						</template>
					</el-menu-item>
			      </el-submenu>
			    </el-menu>
		</el-aside>
		<!--主体区域-->
	    <el-main>
			<router-view></router-view><!--路由占位符-->
		</el-main>
	  </el-container>
	</el-container>
</template>

<script>
	export default{
		data() {
			return{
				menuList: [],
				iconsList:{
					125:'el-icon-s-custom',
					103:'el-icon-upload',
					101:'el-icon-s-shop',
					102:'el-icon-s-order',
					145:'el-icon-s-platform'
				},
				iscollapse:false,
				//被激活的链接地址
				activePath:''
			}
		},
		//生命周期函数
		created(){
			this.getMenuList(),
			this.activePath = window.sessionStorage.getItem('ActPath')
		},
		methods:{
			logout(){
				//退出登录清空sessionStirage中的token,并再次进行跳转
				window.sessionStorage.clear()
				this.$router.push('/login')
			},
			//获取左侧菜单的数据
			async getMenuList(){
				const {data : result} = await this.$http.get('menus') //menus是接口，get请求默认获取的是promise对象所以需要用async和await 解析
				if(result.meta.status !== 200){
					return this.$message.error(result.meta.msg)
				}else{
					this.menuList = result.data
				}
				console.log(result)
			},
			//点击按钮切换侧边栏区域
			toggle(){
				this.iscollapse=!this.iscollapse
			},
			saveIndex(ActPath){
				window.sessionStorage.setItem('ActPath',ActPath)
			}
		}
	}
</script>

<style scoped>
	.el-header{
		background-color: #446491;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.el-aside{
		background-color: #4b89ac;
	}
	.el-aside .el-menu{
		border: none;
	}
	.el-main{
		background-color: #f8f8f8;
	}
	.home-container{
		height: 100%;
	}
	.toggle{
		background-color: #778899;
		text-align: center;
		font-size: 10px;
		line-height: 24px;
		color: white;
		letter-spacing: 2px;
		cursor: pointer;
	}
</style>
