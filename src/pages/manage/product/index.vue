<template>
	<view class="content">
		<u-cell-group>
			<u-cell v-for="item in productOrderList" :key="item.id">
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
					<view style="color:#909193">商品列表:
						<view v-for="item2 in item.order_product" :key="item2.id">
							{{ item2.product.name }} x {{ item2.nums }} : {{ item2.product.price }}元
						</view>
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						订单金额：{{ item.amount }} 元
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						订单状态：{{ item.status_text }}
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
			productOrderList: [],
		};
	},
	methods: {
		async getData() {
			let result = await this.$u.api.manage.productIndex({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.productOrderList = result.data
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
