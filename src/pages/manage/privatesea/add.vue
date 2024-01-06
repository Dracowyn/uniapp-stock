<template>
	<view class="container">
		<u--form labelPosition="left" labelWidth="70" :model="userInfo" :rules="rules" ref="form1">
			<view class="avatar">
				<u-upload
					:fileList="fileList"
					@afterRead="afterRead"
					@delete="deletePic"
					name="avatar"
					width="100"
					height="100"
					style="border-radius: 100%;" :maxCount="1">
				</u-upload>
			</view>
			<u-form-item label="客户名称:" prop="nickname">
				<u--input
					v-model="userInfo.nickname" placeholder="请输入名称"
					border="surround"
				></u--input>
			</u-form-item>
			<u-form-item label="手机号码:" prop="mobile">
				<u--input
					v-model="userInfo.mobile" placeholder="请输入手机号码"
					border="surround"
				></u--input>
			</u-form-item>
			<u-form-item label="邮箱:" prop="email">
				<u--input
					v-model="userInfo.email" placeholder="请输入邮箱地址"
					border="surround"
				></u--input>
			</u-form-item>
			<u-form-item label="密码:" prop="password">
				<u--input
					v-model="userInfo.password" placeholder="请输入密码"
					border="surround"
				></u--input>
			</u-form-item>
			<u-form-item label="认证:">
				<u-radio-group
					v-model="userInfo.auth"
					placement="row">
					<u-radio name="0" label="未认证" style="margin-right: 10px;"></u-radio>
					<u-radio name="1" label="已认证" style="margin-right: 10px;"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="性别:">
				<u-radio-group
					v-model="userInfo.gender"
					placement="row">
					<u-radio name="0" label="保密" style="margin-right: 10px;"></u-radio>
					<u-radio name="1" label="男" style="margin-right: 10px;"></u-radio>
					<u-radio name="2" label="女"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="余额">
				<u--input
					v-model="userInfo.money" placeholder="请输入余额"
					border="surround"
				></u--input>
			</u-form-item>
			<u-form-item label="成交状态:">
				<u-radio-group
					v-model="userInfo.deal"
					placement="row">
					<u-radio name="0" label="未成交" style="margin-right: 10px;"></u-radio>
					<u-radio name="1" label="已成交" style="margin-right: 10px;"></u-radio>
				</u-radio-group>
			</u-form-item>
			<u-form-item label="地区选择:" prop="region" @click="regionShow = true">
				<pick-regions :defaultRegion="userInfo.region" @getRegion="handleGetRegion">
					<u--input v-model="userInfo.region_text" disabled disabledColor="#ffffff" placeholder="请选择地区">
					</u--input>
					<u-icon slot="right" name="arrow-right">
					</u-icon>
				</pick-regions>
			</u-form-item>
			<u-form-item label="客户来源:" prop="sourceid" @click="isSource = true">
				<u--input v-model="userInfo.sourceName" disabled disabledColor="#ffffff" placeholder="请选择回访客户"
						  suffixIcon="arrow-down">
				</u--input>
			</u-form-item>
		</u--form>
		<u-button @click="onSubmit" color="#19BC9C">添加</u-button>
		<!-- 来源数据 -->
		<u-picker :show="isSource" :columns="sourceList" keyName="name" @cancel="isSource = false"
				  @confirm="confirm"></u-picker>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
import pickRegions from '@/components/pick-regions/pick-regions.vue'
export default {
	components: {
		pickRegions
	},
	data() {
		return {
			userInfo: {
				nickname: '',
				mobile: '',
				email: '',
				gender: '0',
				deal: 0,
				password: '',
				sourceId: null,
				sourceName: '',
				auth: '0',
				money: 0.00,
				avatar: '',
				region_text: '',
				regionCode: null,
			},
			rules: {
				nickname: [{
					required: true,
					message: '请输入客户名称',
					trigger: ['blur', 'change']
				}],
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
				money: [{
					validator: (rule, value, callback) => {
						if (value) {
							return uni.$u.test.amount(value);
						} else {
							return true;
						}
					},
					type: 'string',
					message: '请输入正确的金额',
					trigger: ['blur', 'change'],
				}],
			},
			sourceList: [],
			isSource: false,
			fileList: [],
			regionShow: false,
		};
	},
	onReady() {
		this.$refs.form1.setRules(this.rules)
		this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};
		this.getSourceList()
	},
	methods: {
		async getSourceList() {
			let result = await this.$u.api.manage.sourceIndex({
				adminid: this.LoginAdmin.id,
			});
			if (result.code === 1) {
				this.sourceList.push(result.data)
			}
		},

		confirm(e) {
			this.userInfo.sourceId = e.value[0].id
			this.userInfo.sourceName = e.value[0].name;
			this.isSource = false;
		},

		onSubmit() {
			this.$refs.form1.validate().then(async (res) => {
				let data = {
					nickname: this.userInfo.nickname,
					mobile: this.userInfo.mobile,
					email: this.userInfo.email,
					avatar: this.userInfo.avatar,
					gender: this.userInfo.gender,
					sourceid: this.userInfo.sourceId,
					auth: this.userInfo.auth,
					money: this.userInfo.money,
					deal: this.userInfo.deal,
					password: this.userInfo.password,
					adminid: this.LoginAdmin.id,
					region: this.userInfo.regionCode,
				}

				let result = await this.$u.api.manage.privateseaAdd(data);

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
			})
		},

		// 头像上传相关方法
		deletePic(info) {
			console.log('deletePic', info);
			this.fileList = [];
			this.userInfo.avatar = '';
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

			let result = await this.$u.api.manage.privateseaAvatar(data);

			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						this.fileList = [{
							url: result.data.avatar_cdn
						}];
						this.userInfo.avatar = result.data.avatar;
					}
				});
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				});
			}
		},


		// 地区选择相关方法
		handleGetRegion(item) {
			let [province, city, district] = item
			let region_text = ''
			let code = null
			let region = []

			if (province) {
				region_text += province.name + '-'
				region.push(province.name)
				code = province.code
			}

			if (city) {
				region_text += city.name + '-'
				region.push(city.name)
				code = city.code
			}

			if (district) {
				region_text += district.name
				region.push(district.name)
				code = district.code
			}

			this.userInfo.region_text = region_text
			this.userInfo.regionCode = code
			console.log('region', code)
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

.avatar {
	text-align: center;
}

.u-avatar {
	margin: 80rpx auto 40rpx;
}

.avatar .u-upload {
	justify-content: center;
	align-items: center;
	margin: 1em 0;
}
</style>
