<template>
	<view class="content">
		<u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="form1">
			<u-cell-group>
				<u-cell title="客户名称" :value="userInfo.nickname"></u-cell>
				<u-cell title="性别" :value="userInfo.gender"></u-cell>
				<u-cell title="客户来源" :value="userInfo.source"></u-cell>
				<u-cell title="成交状态" :value="userInfo.deal"></u-cell>
				<u-cell title="创建时间" :value="userInfo.create_time"></u-cell>
			</u-cell-group>
			<u-form-item label="分配人员:" prop="username" @click="show = true">
				<u--input v-model="userInfo.adminNickname" disabled disabledColor="#ffffff" placeholder="请选择"
						  suffixIcon="arrow-down">
				</u--input>
			</u-form-item>
		</u--form>
		<u-button @click="submit" color="#19BC9C">确认分配</u-button>
		<u-picker :show="show" :columns="adminList" keyName="username" @cancel="show = false"
				  @confirm="confirm"></u-picker>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {
				id: 0,
				nickname: '',
				gender: '',
				source: '',
				deal: '',
				create_time: '',
				adminid: 0,
				adminNickname: '',
			},
			rules: {
				'content': {
					type: 'string',
					required: true,
					message: '请填写回访内容',
					trigger: ['blur', 'change']
				}
			},
			adminList: [],
			show: false,
			LoginAdmin: uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {},
		}
	},
	onLoad(options) {
		this.userInfo.id = options.id ? options.id : 0
		console.log(this.userInfo.id);
		this.getAdminData()
		this.getBusinessInfo()
	},
	methods: {
		async getAdminData() {
			let result = await this.$u.api.admin.list({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.adminList.push(result.data)
			}
		},
		async getBusinessInfo() {
			let result = await this.$u.api.manage.highseaInfo({
				id: this.userInfo.id,
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.userInfo.nickname = result.data.nickname
				if (result.data.gender === '0') {
					this.userInfo.gender = '保密'
				} else if (result.data.gender === '1') {
					this.userInfo.gender = '男'
				} else {
					this.userInfo.gender = '女'
				}
				if (result.data.source !== null && result.data.source !== undefined) {
					this.userInfo.source = result.data.source.name;
				} else {
					this.userInfo.source = '未知来源';
				}
				this.userInfo.deal = result.data.deal_text
				this.userInfo.create_time = result.data.create_time_text
			}
		},
		// 回调参数为包含columnIndex、value、values
		confirm(e) {
			this.show = false
			this.userInfo.adminid = e.value[0].id
			if (e.value[0].nickname !== null && e.value[0].nickname !== undefined) {
				this.userInfo.adminNickname = e.value[0].nickname
			} else {
				this.userInfo.adminNickname = e.value[0].username
			}
		},
		async submit() {
			let data = {
				adminid: this.userInfo.adminid,
				id: this.userInfo.id,
			}
			let result = await this.$u.api.manage.highseaAllot(data)
			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						this.$u.route({
							type: 'navigateBack'
						})
					}
				})
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg
				})
			}
		},
	}
}
</script>

<style>

</style>
