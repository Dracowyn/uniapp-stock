<template>
	<view class="container">
		<view class="info">
			<!-- 微信端 -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="left">
				<!-- 如果能获取存储的登录信息就数据库的昵称 -->
				<view class="nickname" v-if="JSON.stringify(LoginAdmin) !== '{}'">
					{{ LoginAdmin.nickname }}
				</view>
				<!-- 如果没有获取到就会显示微信昵称 -->
				<open-data v-else type="userNickName" class="nickname"></open-data>
			</view>
			<view class="right">
				<view class="avatar xcx">
					<u-avatar :src="LoginAdmin.avatar_cdn" size="90"
							  v-if="JSON.stringify(LoginAdmin) !== '{}'"></u-avatar>
					<!-- 如果没有获取到就会显示微信头像 -->
					<open-data type="userAvatarUrl" v-else></open-data>
				</view>
			</view>
			<!-- #endif -->

			<!-- H5和APP端 -->
			<!--  #ifdef H5 || APP-PLUS -->
			<view class="left">
				<view class="nickname" v-if="JSON.stringify(LoginAdmin) !== '{}'">
					{{ LoginAdmin.nickname }}
				</view>
				<view class="nickname" v-else>
					请选登陆
				</view>
				<view class="email" v-if="JSON.stringify(LoginAdmin) !== '{}'">
					{{ LoginAdmin.email }}
				</view>
			</view>
			<view class="right">
				<view class="avatar">
					<u-avatar :src="LoginAdmin.avatar_cdn" size="90"
							  v-if="JSON.stringify(LoginAdmin) != '{}'"></u-avatar>
					<u-avatar src="/static/avatar.jpg" size="90" v-else></u-avatar>
				</view>
			</view>
			<!-- #endif -->
		</view>

		<!-- 标签栏 -->
		<view class="banner-warpper">
			<view class="banner">
				<view class="left">
					<view class="group" v-if="JSON.stringify(LoginAdmin) !== '{}'">
						{{ LoginAdmin.group_text }}
					</view>
					<view class="group" v-else>
						暂无角色组
					</view>
					<view class="join">
						加入时间：{{
							JSON.stringify(LoginAdmin) != '{}' ? $u.timeFormat(LoginAdmin.createtime, 'yyyy年mm月dd日 hh时MM分') : '无'
						}}
					</view>
				</view>
				<view class="right">
					<!-- #ifdef MP-WEIXIN -->
					<u-button :customStyle="btnStyle" size="small" icon="chat" shape="circle" openType="feedback">问题反馈
					</u-button>
					<!-- #endif -->
					<!--  #ifdef H5 || APP-PLUS -->
					<u-button :customStyle="btnStyle" size="small" icon="chat" shape="circle" @click="feedback">问题反馈
					</u-button>
					<!-- #endif -->
				</view>
			</view>
		</view>

		<!-- 宫格布局 -->
		<view class="grid1" v-if="JSON.stringify(LoginAdmin) !== '{}'">
			<u-grid :border="false" col="4" @click="changOperation">
				<u-grid-item v-for="(listItem,listIndex) in list" :key="listIndex" :name="listItem.name">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" color="#19BC9C" :size="29">
					</u-icon>
					<text class="grid-text">{{ listItem.title }}</text>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 消息提醒 -->
		<view class="actions">
			<!-- #ifdef MP-WEIXIN -->
			<view class="contact" v-if="JSON.stringify(LoginAdmin) !== '{}'">
				<u-button icon="chat" openType="contact">联系助手
				</u-button>
			</view>
			<view class="contact" v-else>
				<u-button icon="chat">联系助手
				</u-button>
			</view>
			<view class="logout" v-if="JSON.stringify(LoginAdmin) !== '{}'">
				<u-button type="error" text="注销登陆" @click="onLogout"></u-button>
			</view>
			<view class="logout" v-else>
				<u-button type="primary" icon="weixin-circle-fill" @click="onWxLogin">微信一键登陆</u-button>
			</view>
			<!-- #endif -->
			<!--  #ifdef H5 || APP-PLUS -->
			<view class="contact">
				<u-button icon="chat" @click="feedback">联系助手
				</u-button>
			</view>
			<view class="logout" v-if="JSON.stringify(LoginAdmin) !== '{}'">
				<u-button type="error" text="注销登陆" @click="onLogout"></u-button>
			</view>
			<view class="logout" v-else>
				<u-button type="primary" @click="toLogin">登陆帐号</u-button>
			</view>
			<!-- #endif -->
		</view>

		<!-- 消息提示 -->
		<u-toast ref="uToast"></u-toast>
		<!-- 模态框 -->
		<u-modal
			:show="show"
			:title="title"
			:content='content'
			@confirm="onConfirm"
			showCancelButton
			@cancel="show = !show"
		/>
	</view>
</template>
<script>
export default {
	data() {
		return {
			LoginAdmin: {},
			btnStyle: {
				width: '180rpx'
			},
			list: [
				{
					name: 'coupon-fill',
					title: '修改资料'
				},
				{
					name: 'checkmark-circle-fill',
					title: '微信解绑'
				},
				{
					name: 'man-add-fill',
					title: '领取记录'
				},
				{
					name: 'photo-fill',
					title: '回访记录'
				}
			],
			show: false,
			title: '未知标题',
			content: '未知内容',
			action: 'logout'
		}
	},
	methods: {
		feedback() {
			console.log('H5端反馈');
		},
		// 解除微信绑定
		changOperation(name) {
			switch (name) {
				case 'checkmark-circle-fill':
					this.title = '解除微信绑定';
					this.content = '确定要解除微信绑定吗？';
					this.action = 'unbind';
					this.show = true;
					break;
			}
		},
		toLogin() {

		},
		// 注销登录
		onLogout() {
			this.title = '注销登录';
			this.content = '确定要注销登录吗？';
			this.action = 'logout';
			this.show = true;
		},
		// 微信一键登录
		onWxLogin() {
			uni.login({
				provider: "weixin",
				success: async (res) => {
					let code = res.code ? res.code : '';

					let result = await this.$u.api.admin.login({code});

					if (result.code === 1) {
						this.$refs.uToast.show({
							type: 'success',
							message: result.msg,
							complete: () => {
								uni.setStorageSync('LoginAdmin', result.data);
								this.LoginAdmin = result.data;
							}
						});
					} else {
						this.$refs.uToast.show({
							type: 'error',
							message: result.msg,
							complete: () => {
								let openid = result.data.openid ?? '';

								if (openid) {
									this.$u.route({
										url: '/pages/admin/bind',
										params: {
											openid: openid
										}
									})
								}
							}
						});
					}
				}
			});
		},
		// 确认事件
		onConfirm() {
			let action = this.action;
			this.show = false;

			switch (action) {
				case 'logout':
					this.Logout();
					break;
				case 'unbind' :
					this.onUnbind();
					break;
			}
		},
		// 注销登录
		Logout() {
			this.$refs.uToast.show({
				type: 'success',
				message: '注销成功',
				complete: () => {
					uni.removeStorageSync('LoginAdmin');
					this.LoginAdmin = {};
				}
			});
		},
		// 解除微信绑定
		async onUnbind() {
			let result = await this.$u.api.admin.unbind();

			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						uni.removeStorageSync('LoginAdmin');
						this.LoginAdmin = {};
					}
				});
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				});
			}
		},

		onShow() {
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ?? {};
		},
	},
}
</script>

<style>
page {
	background-color: #fff;
}

.container {
	margin: 0;
}

.info {
	display: flex;
	padding: 40rpx;
	background-color: #f5f5f5;
}

.info .left {
	flex: 3;
}

.info .left {
	flex: 3;
	display: flex;
	align-items: center;
	align-content: center;
}

.info .right {
	flex: 1
}

.info .right .xcx {
	width: 200rpx;
	height: 200rpx;
	border-radius: 100%;
	overflow: hidden;
}

.info .left .nickname {
	font-size: 26px;
	font-weight: bold;
}

.info .left .email {
	font-size: 12px;
	color: gray;
}

.banner-warpper {
	background-color: #f5f5f5;
}

.banner {
	width: auto;
	margin: 0 40rpx;
	border-top-right-radius: 10px;
	border-top-left-radius: 10px;
	height: 60px;
	background: rgb(34, 52, 70);
	background: linear-gradient(133deg, rgba(34, 52, 70, 1) 35%, rgba(44, 62, 80, 1) 100%);
	box-shadow: 0 10px 10px var(--color-dark);
	display: flex;
	justify-content: center;
	align-items: center;
}

.banner .left {
	flex: 3;
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
}

.banner .right {
	flex: 2;
	display: flex;
	justify-content: center;
}

.banner .left .group {
	color: #fff;
	font-size: 16px;
	font-weight: bold;
}

.banner .left .join {
	color: #aaa;
	font-size: 10px;
	padding-top: 4px;
}

.grid1 {
	padding: 20px 40rpx;
	background-color: #fff;
}

.grid1 .van-grid-item {
	color: var(--color-primary);
}

.grid2 {
	padding: 0 40rpx;
	background-color: #fff;
}

.grid2 .title {
	font-size: 16px;
	font-weight: bold;
	padding: 0 10rpx 10px;
}

.actions {
	display: flex;
	padding: 20px 40rpx;
}

.contact {
	flex: 1;
	padding-right: 4px;
}

.logout {
	flex: 1;
	padding-left: 4px;
}

.btn-vertical {
	background-color: rgb(0, 0, 0, 0) !important;
	border: 0 !important;
	width: 100%;
	height: 100% !important;
	padding: 15px !important;
}

.btn-vertical.van-button--active:before {
	opacity: 1;
	background-color: rgb(0, 0, 0, 0) !important;
}

.btn-vertical__icon {
	font-size: 26px;
	align-items: center;
	justify-content: center;
}

.btn-vertical__text {
	margin-top: 6px;
	word-wrap: break-word;
	color: var(--grid-item-text-color, #646566);
	font-size: var(--grid-item-text-font-size, 12px);
}
</style>