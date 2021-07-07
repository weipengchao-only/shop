<template>
	<div id="">
		<el-button type="info" @click="logout">退出登录</el-button>
	</div>
</template>

<script>
	export default{
		methods:{
			logout(){
				//退出登录清空sessionStirage中的token,并再次进行跳转
				window.sessionStorage.clear()
				this.$router.push('/login')
			}
		}
	}
</script>

<style scoped>
</style>
