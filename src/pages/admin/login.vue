<template>
	<view class="container">
		<view class="title">
			<text>登录你的账号</text>
		</view>

		<view style="width: 90%;">
			<u--form
				labelWidth="90"
				lableAlign="center"
				:model="userInfo"
				:rules="rules"
				ref="uForm">
				<u-form-item label="用户名" prop="username" class="item">
					<u--input v-model="userInfo.username"></u--input>
				</u-form-item>
				<u-form-item label="密码" prop="password" class="item">
					<u--input v-model="userInfo.password" password></u--input>
				</u-form-item>
				<!-- 用户协议 -->
				<u-form-item prop="agreement" class="item">
					<view class="agreement">
						<u-checkbox-group v-model="userInfo.agreement">
							<u-checkbox name="agreement" label="我已阅读并同意"/>
							<navigator class="url" url="/pages/index/agreement">用户服务协议、隐私政策</navigator>
						</u-checkbox-group>
					</view>
				</u-form-item>
			</u--form>
		</view>

		<view style="margin-top: 10px;">
			<u-button type="warning" icon="pushpin-fill" @click="onLogin">登录</u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				username: '',
				password: '',
				agreement: [],
			},

			rules: {
				'username': {
					type: 'string',
					required: true,
					message: '请输入用户名',
					trigger: ['blur', 'change'],
				},
				'password': {
					type: 'string',
					required: true,
					message: '请输入密码',
					trigger: ['blur', 'change'],
				},
				'agreement': {
					type: 'array',
					required: true,
					message: '请阅读并同意用户服务协议、隐私政策',
					trigger: ['blur', 'change'],
				},
			}
		};
	},
	methods: {
		onLogin() {
			console.log('onLogin');
			this.$refs.uForm.validate().then(async (res) => {
				let data = {
					username: this.userInfo.username,
					password: this.userInfo.password,
				}

				let result = await this.$u.api.admin.login2(data);
				console.log(result);

				if (result.code === 1) {
					console.log('login success')
					this.$refs.uToast.show({
						title: '登录',
						message: result.msg,
						complete: () => {
							uni.setStorageSync('LoginAdmin', result.data);
							// uni.switchTab({
							// 	url: '/pages/admin/index',
							// })
							this.$u.route({
								type: 'navigateBack'
							})
						}
					})
				} else {
					console.log('login error')
					this.$refs.uToast.show({
						type: 'error',
						message: result.msg,
					});
				}
			}).catch(() => {
			})
		}
	},
	onReady() {
		console.log('onReady')
		this.$refs.uForm.setRules(this.rules);
	},
}
</script>

<style lang="scss">
.container {
	height: 100%;
	margin: 0 80rpx;
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
	font-size: 20px;
}

.img-captcha {
	display: block !important;
}

.btn-submit {
	margin-top: 40rpx !important;
}

.href-bindmobile {
	margin-top: 40rpx;
	text-align: center;
	font-size: 14px;
	color: var(--color-primary);
}

.u-form .u-form-item__body__right__message {
	margin-left: 0px !important;
}

/* #ifdef MP-WEIXIN  */
/deep/ .u-form .u-form-item__body__right__message {
	margin-left: 90px !important;
}

/* #endif    */

.agreement {
	margin-top: .7em;
	display: flex;
}

.agreement .url {
	color: #3c9cff;
	margin-left: 2px;
}
</style>
