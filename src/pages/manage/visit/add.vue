<template>
	<view class="container">
		<u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="uForm">
			<u-form-item label="回访客户" prop="nickname" @click="show = true">
				<u--input v-model="userInfo.nickname" disabled disabledColor="#ffffff" placeholder="请选择回访客户"
						  suffixIcon="arrow-down">
				</u--input>
			</u-form-item>

			<u-form-item label="回访内容" prop="content">
				<u--textarea v-model="userInfo.content" placeholder="请输入内容" count confirmType="done"></u--textarea>
			</u-form-item>
		</u--form>
		<u-button @click="onSubmit" color="#19BC9C">添加回访内容</u-button>

		<u-picker :show="show" :columns="businessList" keyName="nickname" @cancel="show = false"
				  @confirm="confirm"></u-picker>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				nickname: '',
				content: '',
				id: 0,
			},
			rules: {
				nickname: [{
					required: true,
					message: '请选择回访客户',
					trigger: 'change'
				}],
				content: [{
					required: true,
					message: '请输入回访内容',
					trigger: 'blur'
				}],
			},
			businessList: [],
			show: false,
		};
	},
	async onReady() {
		this.$refs.uForm.setRules(this.rules);
		let result = await this.$u.api.manage.visitBusiness({
			adminid: this.LoginAdmin.id,
		})
		if (result.code === 1) {
			this.businessList.push(result.data)
		} else {
			this.$refs.uToast.show({
				type: 'error',
				message: result.msg,
				complete: () => {
					this.$u.route({
						type: "navigateBack",
					});
				}
			})
		}
	},
	methods: {
		confirm(e) {
			this.userInfo.nickname = e.value[0].nickname
			this.userInfo.business_id = e.value[0].id
			this.show = false;
		},
		onSubmit() {
			this.$refs.uForm.validate().then(async () => {
				let data = {
					busid: this.userInfo.business_id,
					content: this.userInfo.content,
					adminid: this.LoginAdmin.id,
				}
				let result = await this.$u.api.manage.visitAdd(data)
				if (result.code === 1) {
					this.$refs.uToast.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							this.$u.route({
								type: "navigateBack",
							});
						}
					})
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: result.msg,
					})
				}
			}).catch((err) => {
				this.$refs.uToast.show({
					type: 'error',
					message: err.msg,
				})
			})
		},
		onShow() {
			let AuthStatus = this.$u.auth.check()
			if (AuthStatus === false) return
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}
		},
	},
}
</script>

<style>
.container {
	height: 100%;
	margin: 0 50rpx;
	box-sizing: border-box;
}
</style>
