<template>
	<view class="container">
		<view class="avatar">
			<!-- 上传组件 -->
			<u-upload
				:fileList="fileList"
				@afterRead="afterRead"
				@delete="deletePic"
				name="avatar"
				width="100"
				height="100"
				style="border-radius: 100%;" :maxCount="1">
			</u-upload>

			<!-- 表单内容 -->
			<u--form labelPosition="left" :model="LoginAdmin" :rules="rules" ref="uForm">
				<u-form-item label="昵称" prop="nickname" borderBottom>
					<u--input
						v-model="LoginAdmin.nickname"
						border="none"
						placeholder="请输入昵称">
					</u--input>
				</u-form-item>
				<u-form-item label="手机" prop="mobile" borderBottom>
					<u--input
						v-model="LoginAdmin.mobile"
						border="none"
						placeholder="请输入手机号">
					</u--input>
				</u-form-item>
				<u-form-item label="邮箱" prop="email" borderBottom>
					<u--input
						v-model="LoginAdmin.email"
						border="none"
						placeholder="请输入邮箱">
					</u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" borderBottom>
					<u--input
						type="password"
						v-model="LoginAdmin.password"
						border="none"
						placeholder="登录密码为空即不修改密码"></u--input>
				</u-form-item>
			</u--form>

			<!-- 按钮 -->
			<view style="margin-top: 25px;">
				<u-button type="warning" @click="onSubmit">修改资料</u-button>
			</view>

			<!-- 提示 -->
			<u-toast ref="uToast"></u-toast>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			rules: {
				mobile: [{
					validator: (rule, value, callback) => {
						if (value) {
							return uni.$u.test.mobile(value);
						} else {
							return true;
						}
					},
					type: 'string',
					required: true,
					message: '请输入正确的手机号码',
					trigger: ['blur', 'change'],
				}],
				email: [{
					type: 'email',
					required: true,
					message: '请输入正确的邮箱',
					trigger: ['blur', 'change'],
				}],
			},
			LoginAdmin: {
				nickname: '',
				mobile: '',
				email: '',
				password: '',
			},
			fileList: [],
		};
	},
	methods: {
		onSubmit() {
			console.log('onSubmit');
			this.$refs.uForm.validate().then(async () => {
				let data = {
					nickname: this.LoginAdmin.nickname.trim(),
					mobile: this.LoginAdmin.mobile.trim(),
					email: this.LoginAdmin.email.trim(),
					adminid: this.LoginAdmin.id,
				}

				if (this.LoginAdmin.password) {
					if (this.LoginAdmin.password.length < 6 || this.LoginAdmin.password.length > 20) {
						this.$refs.uToast.show({
							type: 'error',
							message: '密码长度为6-20位',
						});
						return;
					}
					data.password = this.LoginAdmin.password.trim();
				}

				let result = await this.$u.api.admin.profile(data);

				if (result.code === 1) {
					this.$refs.uToast.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							uni.setStorageSync('LoginAdmin', result.data);
							this.$u.route({
								type: 'navigateBack'
							})
						}
					});
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: result.msg,
					});
				}
			})
		},
		deletePic(info) {
			console.log('deletePic', info);
			this.fileList = [];
		},
		async afterRead(info) {
			console.log('afterRead', info);
			let data = {
				filePath: info.file.thumb,
				name: 'avatar',
				formData: {
					adminid: this.LoginAdmin.id,
				}
			}

			let result = await this.$u.api.admin.avatar(data);

			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						uni.setStorageSync('LoginAdmin', result.data);
						this.fileList = [{
							url: result.data.avatar_cdn
						}];
					}
				});
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				});
			}
		},
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
		this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
		if (this.LoginAdmin.avatar_cdn) {
			this.fileList = [{
				url: this.LoginAdmin.avatar_cdn
			}];
		}
	},
}
</script>

<style lang="scss">
.container {
	height: 100%;
	margin: 0 50rpx;
	box-sizing: border-box;
}

.avatar {
	text-align: center;
}

.u-avatar {
	margin: 80rpx auto 40rpx;
}

.xcx {
	width: 200rpx;
	height: 200rpx;
	margin: 80rpx auto 40rpx;
	border-radius: 100%;
	overflow: hidden;
}

.nickname {
	font-size: 14px;
	text-align: center;
}

.title {
	text-align: center;
	margin: 40rpx 0;
	font-size: 14rpx;
}

.avatar .u-upload {
	justify-content: center;
	align-items: center;
	margin: 3em auto;

}
</style>
