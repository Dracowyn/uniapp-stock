<template>
	<view class="container">
		<u-form label-position="left"
				label-width="90"
				:model="Source"
				:rules="rules"
				ref="uForm">
			<u-form-item label="客户来源" prop="name" border-bottom>
				<u-input v-model="Source.name" placeholder="请输入客户来源名称" border="none"></u-input>
			</u-form-item>
		</u-form>
		<view style="margin-top: 25px">
			<u-button type="primary" @click="onSubmit" text="新增"/>
		</view>
		<u-toast ref="uToast"/>
	</view>
</template>

<script>
export default {
	data() {
		return {
			Source: {
				name: '',
			},
			rules: {
				name: [{
					required: true,
					message: '请输入客户来源名称',
					trigger: ['blur', 'change']
				}],
			},
			LoginAdmin: uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {},
		};
	},
	onReady() {
		console.log('onReady');
		this.$refs.uForm.setRules(this.rules);
	},
	methods: {
		onSubmit() {
			console.log('onSubmit');
			this.$refs.uForm.validate().then(async () => {
				let data = {
					adminid: this.LoginAdmin.id,
					name: this.Source.name,
				};

				let result = await this.$u.api.manage.sourceAdd(data);

				if (result.code === 1) {
					this.$refs.uToast.show({
						type: 'success',
						message: result.msg,
						complete: () => {
							this.$u.route({
								type: 'navigateBack'
							});
						}
					});
				} else {
					this.$refs.uToast.show({
						type: 'error',
						message: result.msg,
					});
				}
			}).catch((err) => {
				console.log(err);
			});
		}
	},
}
</script>

<style>
.container {
	padding: 0 10px;
}
</style>
