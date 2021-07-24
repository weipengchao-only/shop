<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图航区域 -->
		<el-card>
			<el-row :gutter="20"><!--row的gutter相当于这行中每一列的间距。col的span相当于该列的宽度-->
				<!-- 搜索框区域 -->
				<el-col :span="8">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
					    <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
					  </el-input>
				</el-col>
				<!-- 添加按钮区域 -->
				<el-col :span="4">
					<el-button type="primary" @click="goAddPage">添加商品</el-button>
				</el-col>
			</el-row>
			<!-- 商品列表区域 -->
			<el-table :data="goodsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="商品名称" prop="goods_name"></el-table-column>
				<el-table-column label="商品价格(元)" prop="goods_price" width="150px"></el-table-column>
				<el-table-column label="商品重量(kg)" prop="goods_weight" width="150px"></el-table-column>
				<el-table-column label="创建时间" prop="add_time" width="200px">
					<template slot-scope="scope">
						{{scope.row.add_time | dateFormat}}<!-- 使用过滤器生成年月日时间 -->
					</template>
				</el-table-column>
				<el-table-column label="操作" width="320px">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
						<el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		    <!-- 页码区域 -->
			<el-pagination
		          @size-change="handleSizeChange"
		          @current-change="handleCurrentChange"
		          :current-page="queryInfo.pagenum"
		          :page-sizes="[3, 5, 7, 10]"
		          :page-size="queryInfo.pagesize"
		          layout="total, sizes, prev, pager, next, jumper"
		          :total="400" background>
		        </el-pagination>
		</el-card>
	</div>
</template>
 
<script>
	export default {
		data(){
			return {
				//查询参数对象
			    queryInfo : {
				 query : '',
				 pagenum : 1,
				 pagesize : 5
			    },
				//商品参数列表
				goodsList : [],
				total : 0//商品参数总数量
			}
		},
		methods:{
			//获取商品列表数据
			async getGoodsList(){
				const {data : result} = await this.$http.get('goods',{params : this.queryInfo})
				if (result.meta.status !== 200) {
					return this.$message.error('获取商品数据失败')
				} else{
					this.goodsList = result.data.goods
					this.total = result.data.total
					
				}
			},
			handleSizeChange(newSize){
				this.queryInfo.pagesize = newSize
				this.getGoodsList()
			},
			handleCurrentChange(newPage){
				this.queryInfo.pagenum = newPage
				this.getGoodsList()
			},
			async removeById(goods_id){
				const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
				          confirmButtonText: '确定',
				          cancelButtonText: '取消',
				          type: 'warning'
				        }).catch(err => err)
						if (confirmResult !== 'confirm') {
							return this.$message.info('用户已经取消删除')
						} else{
							const {data : result} = await this.$http.delete(`goods/${goods_id}`)
							if (result.meta.status !== 200) {
								return this.$message.error('删除失败')
							} else{
								return this.$message.success('删除成功')
								this.getGoodsList()
							}
						}
			},
			goAddPage(){
				this.$router.push('/goods/add')
			}
		},
		created() {
			this.getGoodsList()
		}
	}
</script>
 
<style scoped>
</style>
