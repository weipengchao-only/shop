<template>
	<div id="login-big">
		<div id="login-box">
			<!--头像区域-->
			<div id="login-logo">
				<img src="../assets/logo.png">
			</div>
			<!--输入框区域-->
			<el-form ref="loginRef" :model="form" :rules="rules" class="login-form" label-width="00px">
				<!--用户名-->
				<el-form-item prop="username">
					<el-input v-model="form.username" prefix-icon="el-icon-user-solid" placeholder="请输入用户名"></el-input>
				</el-form-item>
				<!--密码-->
				<el-form-item prop="password">
					<el-input v-model="form.password" prefix-icon="el-icon-unlock" placeholder="请输入密码" show-password>
					</el-input>
				</el-form-item>
				<!--按钮区域-->
				<el-form-item class="btn">
					<el-button type="success" @click="login">确定</el-button>
					<el-button type="danger" @click="reset">重置</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				form: {
					username: 'admin',
					password: '123456'
				},
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
					password: [{
							required: true,
							message: '请输密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 12,
							message: '长度在 6 到 12 个字符',
							trigger: 'blur'
						}
					]
				}
			}
		},
		methods: {
			//点击重置按钮
			reset() {
				this.$refs.loginRef.resetFields();
			},
			login() {
				this.$refs.loginRef.validate(async valid => {
					if (!valid) {
						return
					} else {
						const {
							data: result
						} = await this.$http.post('login', this.form)
						if (result.meta.status !== 200) {
							return this.$message.error("登录失败！")
						} else {
							this.$message.success("登陆成功！")
							//登陆成功后将得到的token（相当于安全凭证）保存到sessionStorage中
							window.sessionStorage.setItem("token", result.data.token)
							//通过编程式路由跳转到后台主页，地址/home
							this.$router.push('/home')
						}
					}
				});
			}
		}

	}
</script>

<style scoped>
	/*scoped表示该样式只只用于当前组件*/
	#login-big {
		background-color: lightseagreen;
		height: 100%;
	}

	#login-box {
		width: 450px;
		height: 300px;
		background-color: white;
		border: 1px solid white;
		border-radius: 10px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
	}

	#login-logo {
		width: 130px;
		height: 130px;
		border: 1px solid white;
		background-color: white;
		padding: 10px;
		border-radius: 50%;
		box-shadow: 0 0 10px lightslategrey;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -160%);
	}

	#login-logo img {
		width: 100%;
		height: 100%;
		border: 1px solid white;
		border-radius: 50%;
		background-color: whitesmoke;
	}

	.login-form {
		width: 100%;
		position: absolute;
		bottom: 0;
		box-sizing: border-box;
		padding: 20px;
	}

	.btn {
		display: flex;
		justify-content: flex-end;
	}
</style>