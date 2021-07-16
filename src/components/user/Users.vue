<template>
	<div>
		<!--面包屑导航区域-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!--卡片视图-->
		<el-card>
			<!--搜索与添加区域-->
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="7">
					<el-button type="primary" @click="dialogVisible = true ">添加用户</el-button>
				</el-col>
			</el-row>
			<!--人员数据区域 :data绑定数据-->
			<el-table :data="userList" style="width: 100%" stripe>
				<el-table-column type="index"></el-table-column>
				<!--添加索引列-->
				<el-table-column prop="username" label="姓名"></el-table-column>
				<el-table-column prop="email" label="邮箱" width="180"></el-table-column>
				<el-table-column prop="mobile" label="电话"></el-table-column>
				<el-table-column prop="role_name" label="权限"></el-table-column>
				<el-table-column prop="mg_state" label="状态">
					<!--slot-scope="scope"作用域插槽绑定该作用域 scope.row表示该作用域的对象-->
					<template slot-scope="scope">
						<el-switch @change='userStateChange(scope.row)' v-model="scope.row.mg_state"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180">
					<template slot-scope="scope">
						<!--修改按钮-->
						<el-button type="primary" icon="el-icon-edit" size='mini' @click="showEditDialog(scope.row.id)">
						</el-button>
						<!--分配按钮-->
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<!--:enterable="false"鼠标移入时提示文字自动隐藏-->
							<el-button type="warning" icon="el-icon-setting" size='mini' @click="setRole(scope.row)">
							</el-button>
						</el-tooltip>
						<!--删除按钮-->
						<el-button type="danger" icon="el-icon-delete" size='mini'
							@click="removeUserById(scope.row.id)"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!--分页区域-->
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper" :total="this.total">
			</el-pagination>
		</el-card>

		<!--添加用户对话框-->
		<el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%" @close="dialogClose">
			<!--:visible.sync="dialogVisible"用来控制对话框的显示与否，如果dialogVisible值为true则显示，反之隐藏-->
			<!--内容主体区-->
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
				<!--model是数据绑定对象，rules是验证规则对象-->
				<el-form-item label="用户名" prop="username">
					<!--prop跟的是验证的属性名-->
					<el-input v-model="ruleForm.username"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<!--prop跟的是验证的属性名-->
					<el-input v-model="ruleForm.email"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<!--prop跟的是验证的属性名-->
					<el-input v-model="ruleForm.mobile"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<!--prop跟的是验证的属性名-->
					<el-input v-model="ruleForm.password"></el-input>
				</el-form-item>
			</el-form>
			<!--底部按钮区-->
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="adduser">确 定</el-button>
			</span>
		</el-dialog>

		<!--修改用户对话框-->
		<el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
			<el-form ref="editFormRef" :model="editForm" label-width="80px" :rules="rules">
				<el-form-item label="用户名">
					<el-input v-model="editForm.username" disabled></el-input>
					<!--disabled 是对话框禁用-->
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email"></el-input>
					<!--disabled 是对话框禁用-->
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="editForm.mobile"></el-input>
					<!--disabled 是对话框禁用-->
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editUserInfo">确 定</el-button>
			</span>
		</el-dialog>

		<!--分配角色对话框-->
		<el-dialog title="提示" :visible.sync="setRoledialogVisible" width="50%" @close="setRoleDialogClosed">
			<div>
				<p>当前的用户名：{{userInfo.username}}</p>
				<p>当前的用户权限：{{userInfo.role_name}}</p>
				<p>分配新角色：
					<el-select v-model="selectRoleId" placeholder="请选择">
						<el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
						</el-option>
					</el-select>
				</p>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="setRoledialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRoleInfo">确 定</el-button>
			</span>
		</el-dialog>



	</div>
</template>

<script>
	export default {
		data() {
			//验证邮箱的规则
			var checkEmail = (rule, value, callback) => {
				const regEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/

				if (regEmail.test(value)) {
					return callback()
				} else {
					return callback(new Error('请输入合法的邮箱'))
				}
			}
			//验证手机号的规则
			var checkPhone = (rule, value, callback) => {
				const regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/

				if (regPhone.test(value)) {
					return callback()
				} else {
					return callback(new Error('请输入合法的手机号'))
				}
			}

			return {
				//获取用户列表的参数对象
				queryInfo: {
					query: '',
					pagenum: 1, //当前页数
					pagesize: 3 //当前每页显示多少条数据
				},
				userList: [],
				total: 0, //只是设置的是0，在getUserList()之后this.total = result.data.total
				dialogVisible: false, //控制添加对话框的显示与隐藏的布尔值
				editForm: {}, //查询到的用户信息
				editDialogVisible: false, //控制修改信息对话框的显示与隐藏的布尔值
				setRoledialogVisible: false,
				userInfo: {}, //需要被分配角色的用户信息
				roleList: [], //所有角色数据列表
				selectRoleId: '', //已选中的id值
				ruleForm: {
					username: '',
					password: '',
					email: '',
					mobile: ''
				}, //添加用户的表单数据
				rules: {
					username: [{
							required: true,
							message: '请输用户名',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 12,
							message: '长度在 5 到 12 个字符',
							trigger: 'blur'
						}
					],
					email: [{
							required: true,
							message: '请输邮箱',
							trigger: 'blur'
						},
						{
							min: 4,
							max: 30,
							message: '长度在 4 到 30 个字符',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					mobile: [{
							required: true,
							message: '请输电话号码',
							trigger: 'blur'
						},
						{
							min: 11,
							max: 11,
							message: '长度为 11 个字符',
							trigger: 'blur'
						},
						{
							validator: checkPhone,
							trigger: 'blur'
						}
					],
					password: [{
							required: true,
							message: '请输密码',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 12,
							message: '长度在 1 到 12 个字符',
							trigger: 'blur'
						}
					],
				}, //添加表单的验证规则对象

			}
		},
		methods: {
			//获取列表内容请求
			async getUserList() {
				const {
					data: result
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
				if (result.meta.status !== 200) return this.$message.error('获取用户列表失败')
				this.userList = result.data.users
				this.total = result.data.total
				console.log(result)

			},
			//监听pagesize改变的事件
			handleSizeChange(newsize) {
				console.log(newsize)
				this.queryInfo.pagesize = newsize
				this.getUserList()
			},
			//监听页码值改变的事件
			handleCurrentChange(newpage) {
				console.log(newpage)
				this.queryInfo.pagenum = newpage
				this.getUserList()
			},
			//监听switch标签状态的改变
			async userStateChange(userinfo) {
				console.log(userinfo)
				const {
					data: result
				} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
				if (result.meta.status !== 200) {
					userinfo.mg_state = !userinfo.mg_state
					return this.$message.error('更新用户状态失败')
				} else {
					this.$message.success('更新用户状态成功')
				}
			},
			//监听提交表单是否关闭，如果关闭就重置
			dialogClose() {
				this.$refs.ruleForm.resetFields()
			},
			//表单提交的预校验
			adduser() {
				this.$refs.ruleForm.validate(async valid => {
					if (!valid) return
					//可以发起用户表单请求
					const {
						data: result
					} = await this.$http.post('users', this.ruleForm)
					if (result.meta.status !== 201) {
						return this.$message.error("注册账户失败")
					} else {
						this.$message.success("注册账户成功")
						//隐藏添加用户对话框
						this.dialogVisible = false
						//更新用户列表，就是重新获取一次数据
						this.getUserList()
					}

				})
			},
			//显示修改表单对话框
			async showEditDialog(id) {
				const {
					data: result
				} = await this.$http.get('users/' + id)
				if (result.meta.status !== 200) {
					return this.$message.error('用户数据查询失败')
				} else {
					this.editForm = result.data
				}
				this.editDialogVisible = true
			},
			//监听修改表单的关闭后重置
			closeEditDialog() {
				this.$refs.editFormRef.resetFields()
			},
			//提交修改表单前的预验证
			editUserInfo() {
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) return
					//发起修改用户数据信息的请求
					const {
						data: result
					} = await this.$http.put('users/' + this.editForm.id, {
						email: this.editForm.email,
						mobile: this.editForm.mobile
					})

					if (result.meta.status !== 200) {
						return this.$message.error('修改数据请求失败')
					} else {
						//关闭对话框
						this.editDialogVisible = false,
							//重新获取数据
							this.getUserList(),
							//成功提示信息
							this.$message.success('修改数据请求成功')
					}
				})
			},
			async removeUserById(id) {
				const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).catch(err => {
					return err
				})
				//如果用户确认删除，则result返回的是字符串confirm
				//如果用户取消删除，则result返回的是字符串cancle
				if (result !== 'confirm') {
					this.$message.info('已经取消了删除')
				} else {
					const {
						data: result
					} = await this.$http.delete('users/' + id)
					if (result.meta.status !== 200) {
						return this.$message.error('删除用户信息请求失败')
					}
					this.$message.success('删除用户信息成功')
					this.getUserList()
				}
			},
			//展示分配角色的对话框
			async setRole(userInfo) {
				this.userInfo = userInfo
				//在展示对话框之前获取所有的权限列表共选择
				const {
					data: result
				} = await this.$http.get('roles')
				if (result.meta.status !== 200) {
					return this.$message.error('获取用户权限列表请求失败')
				} else {
					this.roleList = result.data
				}
				this.setRoledialogVisible = true
			},
			//点击确认按钮，分配角色
			async saveRoleInfo() {
				if (!this.selectRoleId) {
					return this.$message.error('用户未选择角色')
				}
				const {
					data: result
				} = await this.$http.put(`users/${this.userInfo.id}/role`, {
					rid: this.selectRoleId
				})
				if (result.meta.status !== 200) {
					return this.$message.error('用户角色绑定请求失败')
				} else {
					this.$message.success('用户角色更新成功')
					this.getUserList()
					this.setRoledialogVisible = false
				}
			},
			setRoleDialogClosed() {
				this.selectedRoleId = ''
				this.userInfo = {}
			}
		},
		created() {
			this.getUserList()
		}
	}
</script>

<style scoped>
</style>