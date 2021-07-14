<template>
	<div id="Roles">
		<!--面包屑导航区域-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item >权限管理</el-breadcrumb-item>
		  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		
		<!--卡片视图-->
		<el-card>
			<el-row>
				<el-col>
					<el-button type="primary" @click="dialogVisible = true ">添加角色</el-button>
				</el-col>
			</el-row>
			
			<!--角色数据渲染-->
			<el-table :data="rolesList" border stripe>
				<!--展开列列 type属性值为expand-->
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!--一行里面有两列，两列里面第一列是一级权限，第二列是第二三级权限 共占24列-->
						<el-row class="vcenter" v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<!--一级权限渲染 占5列-->
							<el-col :span="5">
								<el-tag>{{item1.authName}}</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<!--二，三级权限渲染 占19列-->
							<el-col :span="19">
								<el-row class="vcenter" v-for="(item2,i2) in item1.children" :key="item2.id">
									<el-col :span="5">
										<el-tag type="warning">{{item2.authName}}</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="14">
										<el-tag v-for="(item3,i3) in item2.children" :key="item3.id" type="success" closable
										 @close="removeRightId(scope.row,item3.id)">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<!--索引列-->
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作" width="300px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
						<el-button type="warning" icon="el-icon-setting" size="mini" @click="setRightDialog(scope.row)">分配权限</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		
		<!--添加用户对话框-->
		<el-dialog
		  title="添加用户"
		  :visible.sync="dialogVisible"
		  width="50%"
		  @close="dialogClose">
		  <!--:visible.sync="dialogVisible"用来控制对话框的显示与否，如果dialogVisible值为true则显示，反之隐藏-->
		  <!--内容主体区-->
		 <el-form :model="ruleForm" ref="ruleForm" label-width="70px"><!--model是数据绑定对象，rules是验证规则对象-->
		   <el-form-item label="角色名称" prop="roleName"><!--prop跟的是验证的属性名-->
		     <el-input v-model="ruleForm.roleName"></el-input>
		   </el-form-item>
		   <el-form-item label="角色描述" prop="roleDesc"><!--prop跟的是验证的属性名-->
		     <el-input v-model="ruleForm.roleDesc"></el-input>
		   </el-form-item>
		   </el-form>
		   <!--底部按钮区-->
		  <span slot="footer" class="dialog-footer"> 
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="adduser">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--修改用户对话框-->
		<el-dialog
		  title="修改信息"
		  :visible.sync="editDialogVisible"
		  width="50%"
		  @close="closeEditDialog">
		  <el-form ref="editFormRef" :model="editForm" label-width="80px" >
		    <el-form-item label="角色名称">
		      <el-input v-model="editForm.roleName" ></el-input>
		    </el-form-item>
			<el-form-item label="角色描述" prop="email">
			  <el-input v-model="editForm.roleDesc" ></el-input>
			</el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editUserInfo">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!--分配权限对话框对话框-->
		<el-dialog
		  title="分配权限"
		  :visible.sync="setRightDialogVisible"
		  width="50%"
		  @close="setRightDialogClose"
		  >
		  <el-tree :data="rightsList" :props="defaultProps" 
		  show-checkbox node-key="id" default-expand-all 
		  :default-checked-keys="defkeys" ref="treeRef"></el-tree>
		  <!--show-checkbox显示复选框，
		  node-key="id"每个节点选中之后绑定的值是id值，
		  default-expand-all默认展开所有节点，
		  default-checked-keys默认勾选的节点的 key 的数组-->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="setRightDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="allotRights">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
 
<script>
	export default {
		data(){
			return {
				rolesList:[],
				dialogVisible:false,//控制添加对话框的显示与隐藏的布尔值
				ruleForm:{
					roleName:'',
					roleDesc:''
				},
				editForm : {},//查询到的用户信息
				editDialogVisible:false,//控制修改信息对话框的显示与隐藏的布尔值
				setRightDialogVisible:false,//控制权限分配对话框的显示与隐藏的布尔值
			    rightsList:[], //所有权限的数据
				//树形控件的属性绑定对象
				defaultProps:{
					label:'authName',//树形控件显示的名字
					children:'children'//树形控件用什么实现父子绑定
				},
				defkeys:[],//默认选中的权限节点id值
				roleId: ''// 当前即将分配权限的角色id
			}
		},
		methods:{
			//获取所有角色列表
			async getRlesList(){
				const {data : result} = await this.$http.get('roles')
				if(result.meta.status !== 200) return this.$message.error('请求角色数据失败')
				this.rolesList = result.data
				console.log(this.rolesList)
			},
			//监听提交表单是否关闭，如果关闭就重置
			dialogClose(){
				this.$refs.ruleForm.resetFields()
			},
			//表单提交的预校验
			adduser(){
				this.$refs.ruleForm.validate(async valid =>{
					if(!valid)return
					//可以发起用户表单请求
					const {data : result} = await this.$http.post('roles',this.ruleForm)
					if(result.meta.status !== 201){
						return this.$message.error("注册账户失败")
					}else{
						this.$message.success("注册账户成功")
						//隐藏添加用户对话框
						this.dialogVisible = false
						//更新用户列表，就是重新获取一次数据
						this.getRlesList()
					}
					
				})
			},
			//显示修改表单对话框
			async showEditDialog(id){
				const {data : result} = await this.$http.get('roles/' + id)
				if(result.meta.status !== 200){
					return this.$message.error('用户数据查询失败')
					} else{
						this.editForm = result.data
					}
				this.editDialogVisible = true
			},
			//监听修改表单的关闭后重置
			closeEditDialog(){
				this.$refs.editFormRef.resetFields()
			},
			//提交修改表单前的预验证
			editUserInfo(){
				this.$refs.editFormRef.validate(async valid =>{
					if(!valid)return
					//发起修改用户数据信息的请求
					const {data : result} = await this.$http.put('roles/' + this.editForm.roleId,{
						roleName : this.editForm.roleName,
						roleDesc : this.editForm.roleDesc
					})
					
					if (result.meta.status !== 200) {
						return this.$message.error('修改数据请求失败')
					} else{
						//关闭对话框
						this.editDialogVisible = false,
						//重新获取数据
						this.getRlesList(),
						//成功提示信息
						this.$message.success('修改数据请求成功')
					}
				})
			},
			async removeUserById(id){
				const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err =>{
							return err
						})
						//如果用户确认删除，则result返回的是字符串confirm
						//如果用户取消删除，则result返回的是字符串cancle
						if (result !== 'confirm') {
							this.$message.info('已经取消了删除')
						} else{
							const {data : result} = await this.$http.delete('roles/' + id)
							if(result.meta.status !== 200){
								return this.$message.error('删除用户信息请求失败')
							}
							this.$message.success('删除用户信息成功')
							this.getRlesList()
						}
			},
			//根据ID删除对应的权限
			async removeRightId(role,rightId){
				//弹框提示是否要删除
				const result = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err =>{
							return err
						})
						if (result !== 'confirm') {
							this.$message.info('已经取消了删除')
						} else{
							const {data : result} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
							if(result.meta.status !== 200){
								return this.$message.error('删除权限失败')
							}
							this.$message.success('删除权限成功')
							role.children = result.data
						}
			},
			//展示分配权限对话框
			async setRightDialog(role){
				this.roleId = role.id
				const {data : result} = await this.$http.get('rights/tree')
				if(result.meta.status !== 200){return this.$message.error('权限数据请求失败')} 
				this.rightsList = result.data
				console.log(this.rightslist)
				this.getLeafKeys(role,this.defkeys)//递归后保存值到defkeys数组中
				this.setRightDialogVisible = true
			},
			//通过递归获取三级权限id值，并保存到defkeys数组中
			getLeafKeys(node, arr) {
			  // 如果当前 node 节点不包含 children 属性，则是三级节点
			  if (!node.children) {
			    return arr.push(node.id)
			  }
			
			  node.children.forEach(item => this.getLeafKeys(item, arr))
			},
			//监听权限树的关闭事件
			setRightDialogClose(){
				this.defkeys = []
			},
			async allotRights() {
			  const keys = [
			    ...this.$refs.treeRef.getCheckedKeys(),
			    ...this.$refs.treeRef.getHalfCheckedKeys()
			  ]
			
			  const idStr = keys.join(',')
			
			  const { data: res } = await this.$http.post(
			    `roles/${this.roleId}/rights`,
			    { rids: idStr }
			  )
			
			  if (res.meta.status !== 200) {
			    return this.$message.error('分配权限失败！')
			  }
			
			  this.$message.success('分配权限成功！')
			  this.getRlesList()
			  this.setRightDialogVisible = false
			}
		},
		created() {
			this.getRlesList()
		}
	}
</script>
 
<style scoped>
	.el-tag{
		margin: 10px;
	}
	.el-row{
		border-bottom: 1px solid #eee;
	}
	.vcenter{
		display: flex;
		align-items: center;
	}
</style>
