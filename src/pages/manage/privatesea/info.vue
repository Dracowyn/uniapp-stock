<template>
	<view class="content">
		<u-cell-group>
			<u-cell title="客户名称" :value="business.nickname"></u-cell>
			<u-cell title="性别" v-if="business.gender === '0'" value="保密"></u-cell>
			<u-cell title="性别" v-else-if="business.gender === '1'" value="男"></u-cell>
			<u-cell title="性别" v-else value="女"></u-cell>
			<u-cell title="手机号码" :value="business.mobile"></u-cell>
			<u-cell title="客户地区" v-if="business.region_text" :value="business.region_text"/>
			<u-cell title="客户地区" v-else value="未知地区"/>
			<u-cell title="客户来源" v-if="business.source.name" :value="business.source.name"></u-cell>
			<u-cell title="客户来源" value="未知来源"></u-cell>
			<u-cell title="成交状态" :value="business.deal_text"></u-cell>
			<u-cell title="创建时间" :value="business.create_time_text"></u-cell>
		</u-cell-group>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			business: {
				source: {
					name: '',
				},
			},
			id: 0,
		};
	},
	onLoad(options) {
		this.id = options.id;
	},
	methods: {
		async getData(id) {
			let result = await this.$u.api.manage.privateseaInfo({
				id: id,
				adminid: this.LoginAdmin.id,
			});
			if (result.code === 1) {
				this.business = result.data;
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
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
			this.getData(this.id);
		},
	},
}
</script>

<style>

</style>
