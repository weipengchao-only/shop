<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>商品管理</el-breadcrumb-item>
			<el-breadcrumb-item>分类参数</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert title="注意:只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon>
			</el-alert>
			<!-- 选择商品分类区域 -->
			<el-row>
				<el-col>
					<span>选择商品的分类：</span>
					<!-- 选择商品分类的级联选择框 -->
					<el-cascader expand-trigger="hover" :options="catelist" :props="cateProps" v-model="selectedKeys"
						@change="parentCateChanged" clearable change-on-select>
					</el-cascader>
				</el-col>
			</el-row>
			<!-- TAB 页签区域 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 添加动态参数的按钮 -->
				<el-tab-pane label="动态参数" name="many">
					<el-button type="primary" size="mini" :disabled="disabledBtn" @click="addDialogVisible=true">添加参数</el-button>
					<!-- 动态参数的表格 -->
					<el-table :data="manyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<!-- 循环渲染tag标签 -->
								<el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closeTag(index,scope.row)">{{item}}</el-tag>
								<!-- 输入的文本框 -->
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								<!-- 添加按钮 -->
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="参数名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditDialog(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- 添加静态属性的按钮 -->
				<el-tab-pane label="静态属性" name="only">
					<el-button type="primary" size="mini" :disabled="disabledBtn" @click="addDialogVisible=true">添加属性</el-button>
					<!-- 静态参数的表格 -->
					<el-table :data="onlyTableData" border stripe>
						<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<!-- 循环渲染tag标签 -->
								<el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable @close="closeTag(index,scope.row)">{{item}}</el-tag>
								<!-- 输入的文本框 -->
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								<!-- 添加按钮 -->
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
						<!-- 索引列 -->
						<el-table-column type="index"></el-table-column>
						<el-table-column label="属性名称" prop="attr_name"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
								<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteEditDialog(scope.row.attr_id)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	    <!-- 添加属性和参数共用的对话框 -->
		<el-dialog
		  :title=" '添加' + titleTest"
		  :visible.sync="addDialogVisible"
		  width="30%"
		  @close="addDialogClose"
		  >
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" >
		    <el-form-item :label="titleTest" prop="attr_name">
		      <el-input v-model="addForm.attr_name"></el-input>
		    </el-form-item>
		    </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addParams">确 定</el-button>
		  </span>
		</el-dialog>
		
		<!-- 修改属性和参数共用的对话框 -->
		<el-dialog
		  :title=" '添加' + titleTest"
		  :visible.sync="editDialogVisible"
		  width="30%"
		  @close="editDialogClose"
		  >
		  <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px" >
		    <el-form-item :label="titleTest" prop="attr_name">
		      <el-input v-model="editForm.attr_name"></el-input>
		    </el-form-item>
		    </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editParams">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				catelist: [],
				cateProps: {
					value: 'cat_id', //选择的父级id值
					label: 'cat_name', //级联选择器显示出来的名字
					children: 'children' //级联选择器的父子绑定方式
				},
				//级联选择器双向绑定到的数组
				selectedKeys: [], //商品级联选择的value值数组，里面是所选父级和子级的id值
				activeName: 'many',
				manyTableData: [], //动态参数的数据
				onlyTableData: [], //静态参数的数据
				addDialogVisible:false,//控制添加弹框显示的布尔值
				addForm:{},//添加参数的表单数据对象
				editDialogVisible:false,//控制修改弹框显示的布尔值
				editForm:{},//修改参数的表单数据对象
				addFormRules:{
					attr_name:[{
							required: true,
							message: '请输参数/属性名',
							trigger: 'blur'
						},
						{
							min: 5,
							max: 12,
							message: '长度在 5 到 12 个字符',
							trigger: 'blur'
						}]
				}
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			//获取商品列表数据
			async getCateList() {
				const {
					data: result
				} = await this.$http.get('categories')
				if (result.meta.status !== 200) {
					return this.$message.error('获取商品列表失败!')
				} else {
					this.catelist = result.data
				}
			},
			//监听父级选择改变的事件
			parentCateChanged() {
				this.getParamsData()
			},
			//获取参数的列表数据
			async getParamsData() {
				console.log(this.selectedKeys)
				//证明选中的不是三级分类
				if (this.selectedKeys.length !== 3) {
					this.selectedKeys = []
					this.manyTableData = []
					this.onlyTableData = []
					return
				}
				const {
					data: result
				} = await this.$http.get(`categories/${this.cateId}/attributes`, {
					params: {
						sel: this.activeName
					}
				})
				if (result.meta.status !== 200) {
					return this.$message.error('获取商品参数失败!')
				} else {
					
					result.data.forEach(item => {
						item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : [],
						//控制该行文本框的显示与隐藏
						item.inputVisible = false
						item.inputValue = ''
					})
					console.log(result.data)
					if (this.activeName === 'many') {
						this.manyTableData = result.data
					} else {
						this.onlyTableData = result.data
					}
				}
			},
			//tab页签点击事件处理函数
			handleTabClick() {
				console.log(this.activeName)
				this.getParamsData()
			},
			//监听添加对话框关闭事件
			addDialogClose(){
				//重置添加对话框
				this.$refs.addFormRef.resetFields()
			},
			//监听修改对话框关闭事件
			editDialogClose(){
				this.$refs.editFormRef.resetFields()
			},
			async showEditDialog(attr_id){
				const {data : result} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params : {attr_sel:this.activeName}})
				if (result.meta.status !== 200) {
					return this.$message.error('获取表单参数失败！')
				} else{
					this.editForm = result.data
				}
				this.editDialogVisible = true
			},
			//点击确定后，添加参数请求
			addParams(){
				this.$refs.addFormRef.validate(async valid => {
					if (!valid) {
						return 
					} else{
						const {data : result} = await this.$http.post(`categories/${this.cateId}/attributes`,
						{
						attr_name:this.addForm.attr_name,
						attr_sel:this.activeName
						}
						)
						if (result.meta.status !== 201) {
							return this.$message.error('添加参数请求失败')
						} else{
							this.$message.success('添加参数成功')
							this.addDialogVisible = false
							this.getParamsData()
						}
					}
					
				})
				
			},
			//点击确定后，修改参数请求
			editParams(){
				this.$refs.editFormRef.validate(async valid => {
					if (!valid) {
						return 
					} else{
						const {data : result} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
						{
						attr_name:this.editForm.attr_name,
						attr_sel:this.activeName
						})
						if (result.meta.status !== 200) {
							return this.$message.error('修改参数失败')
						} else{
							this.$message.success('修改参数成功')
							this.editDialogVisible = false
							this.getParamsData()
						}
			}
			
		})
		},
		//删除参数按钮事件
		async deleteEditDialog(attr_id){
			const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).catch(err => err)
						if(confirmResult !== 'confirm'){
							return this.$message.info('用户已经取消了操作')
						}
						// 删除的业务逻辑
						const {data : result} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
						if(result.meta.status !== 200){
							return this.$message.error('删除参数失败')
						}
						this.$message.success('删除参数成功')
						this.getParamsData()
		},
		//文本框失去焦点或按下enter触发的事件
		async handleInputConfirm(row){
			//如果输入框输入内容为空，则清空输入框，trim()清空字符串中的空格
			if (row.inputValue.trim().length === 0) {
				row.inputValue = ''
				row.inputVisible = false
				return
			} else{
				//如果没有return出去，说明数据内容输入正确，需要对内容做后续处理
				row.attr_vals.push(row.inputValue.trim())
				row.inputValue=''
				row.inputVisible = false
				this.saveAttrvals(row)
			}
		},
		//发起请求保存输入tag的数据到数据库
		async saveAttrvals(row){
			//需要发起请求，将数据保存到数据库中
			const {data : result} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
				attr_name : row.attr_name,
				attr_sel : row.attr_sel,
				attr_vals : row.attr_vals.join(' ')
			})
			if (result.meta.status !== 200) {
				return this.$message.error('添加参数项失败')
			} else{
				return this.$message.success('修改参数项成功')
			}
		},
		//点击按钮展示文本输入框
		showInput(row){
			row.inputVisible = true
			//让文本框自动获取焦点
			this.$nextTick(_ => {
			          this.$refs.saveTagInput.$refs.input.focus();
			        });
		},
		//监听tag标签的删除事件
		closeTag(index,row){
			row.attr_vals.splice(index,1)
			this.saveAttrvals(row)
		}
		},
		//如果添加按钮需要被禁用则返回true,否则返回false
		computed: {
			disabledBtn() {
				if (this.selectedKeys.length !== 3) {
					return true
				}
				return false
			},
			//当前选中的三级分类的Id值
			cateId() {
				if (this.selectedKeys.length === 3) {
					return this.selectedKeys[2]
				} else {
					return null
				}
			},
			//dialog标题属性绑定
			titleTest(){
				if (this.activeName === 'many') {
					return '动态参数'
				} else{
					return '静态属性'
				}
			}
		}
	}
</script>

<style scoped>
	.el-tag{
		margin-right: 10px;
	}
	.el-input{
		width: 200px;
	}
</style>