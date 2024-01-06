<template>
	<view class="container">
		<u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="uForm">
			<u-form-item label="回访客户" prop="nickname">
				<u--input v-model="userInfo.business.nickname" disabled readonly/>
			</u-form-item>
			<u-form-item label="回访内容" prop="content">
				<u--textarea v-model="userInfo.content" placeholder="请输入内容" count
							 confirmType="done"></u--textarea>
			</u-form-item>
		</u--form>
		<u-button @click="onSubmit" color="#19BC9C">保存回访内容</u-button>
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
				content: [{
					required: true,
					message: '请输入回访内容',
					trigger: 'blur'
				}],
			},
		};
	},
	onLoad(event) {
		this.id = event.id ? event.id : 0;
		console.log('onLoad', this.id);
	},
	async onReady() {
		console.log('onReady');
		this.$refs.uForm.setRules(this.rules);
		let result = await this.$u.api.manage.visitInfo({
			adminid: this.LoginAdmin.id,
			id: this.id,
		});
		if (result.code === 1) {
			this.userInfo = result.data;
		} else {
			this.$refs.uToast.show({
				type: 'error',
				message: result.msg,
				complete: () => {
					this.$u.route({
						type: "navigateBack",
					});
				}
			});
		}
	},
	methods: {
		async onSubmit() {
			console.log('onSubmit');
			this.$refs.uForm.validate().then(async () => {
				let result = await this.$u.api.manage.visitEdit({
					adminid: this.LoginAdmin.id,
					id: this.id,
					content: this.userInfo.content,
				});
				if (result.code === 1) {
					this.$refs.uToast.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							this.$u.route({
								type: "navigateBack",
							});
						}
					});
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: result.msg,
					});
				}
			});
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
