<template>
	<view class="content">
		<u-cell-group>
			<u-cell :value="'订单金额:'+item.total+'元'" v-for="item in subjectOrderList" :key="item.id">
				<view slot="title" class="u-slot-title">
					<view style="">
						订单号：{{ item.code }}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						客户名称：{{ item.business.nickname ? item.business.nickname : '未知' }}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						课程名称：{{ item.subject.title }}
					</view>
				</view>
			</u-cell>
		</u-cell-group>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			subjectOrderList: [],

		};
	},
	methods: {
		async getData() {
			let result = await this.$u.api.manage.subjectIndex({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.subjectOrderList = result.data
			}
		},
		onShow() {
			let AuthStatus = this.$u.auth.check()
			if (AuthStatus === false) return
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}
			this.getData()
		},
	},
}
</script>

<style>

</style>
