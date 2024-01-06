<template>
	<view class="content">
		<u-cell-group v-for="item in receiveList" :key="item.id">
			<u-cell :title="'客户名称：' + item.business.nickname" :value="'申请状态：' + item.status_text">
				<view slot="label" style="color: #909193;font-size: 14px; line-height: 18px;margin-top: 10px;">
					<view>申请时间： {{ item.applytime_text }}</view>
				</view>
			</u-cell>
		</u-cell-group>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			receiveList: [],
		};
	},

	methods: {
		async getData() {
			let result = await this.$u.api.manage.receiveIndex({
				adminid: this.LoginAdmin.id,
			});
			if (result.code === 1) {
				this.receiveList = result.data;
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
					complete: () => {
						this.$u.route({
							type: 'navigateBack'
						});
					}
				});
			}
		},
		onShow() {
			let AuthStatus = this.$u.auth.check();
			if (AuthStatus === false) return;
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
			this.getData();
		},
	},
}
</script>

<style lang="scss">

</style>
