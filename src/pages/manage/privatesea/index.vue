<template>
	<view class="content">
		<u-cell-group>
			<u-cell :value="item.deal_text" v-for="item in privateseaList" :key="item.id">
				<view slot="title" class="u-slot-title">
					<view style="">
						{{ item.nickname }}
					</view>
				</view>
				<view slot="label" class="u-slot-label">
					<view style="color:#909193">
						客户来源：{{ item.source.name ? item.source.name : '未知' }}
					</view>
					<view class="btn">
						<u-button type="primary" :customStyle="btnStyle" size="mini" text="详情"
								  @click="getInfo(item.id)"></u-button>
						<u-button type="success" :customStyle="btnStyle" size="mini" text="编辑"
								  @click="toEdit(item.id)"></u-button>
						<u-button type="warning" :customStyle="btnStyle" size="mini" text="回收"
								  @click="getRecovery(item)"></u-button>
						<u-button
							type="error"
							:customStyle="btnStyle"
							size="mini"
							text="删除"
							@click="getDelete(item)"
						>
						</u-button>
					</view>
				</view>
			</u-cell>
		</u-cell-group>
		<u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm"
				 @cancel="show = false"></u-modal>
		<u-toast ref="uToast"></u-toast>
		<u-button
			@click="toAdd"
			:customStyle="addBtnStyle"
			color="#19BC9C"
			type="success">添加客户
		</u-button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			privateseaList: [],
			show: false,
			title: '删除',
			content: '确定删除该客户？',
			action: 'del',
			id: 0,
			btnStyle: {
				width: '10%',
				display: "inline-block",
				marginRight: '5px',
				marginTop: '10px',
				lineHeight: '20px'
			},
			addBtnStyle: {
				width: '100%',
				position: 'fixed',
				bottom: '0',
			}
		};
	},
	methods: {
		async getData() {
			let result = await this.$u.api.manage.privateseaIndex({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.privateseaList = result.data
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				})
			}
		},
		getInfo(id) {
			this.$u.route({
				url: '/pages/manage/privatesea/info',
				params: {
					id: id
				}
			})
		},

		getDelete(item) {
			this.show = true
			this.id = item.id
			this.title = '删除'
			this.content = '确定删除' + item.nickname + '客户？'
			this.action = 'del'
		},

		getRecovery(item) {
			this.show = true
			this.id = item.id
			this.title = '回收'
			this.content = '确定回收' + item.nickname + '客户？'
			this.action = 'recovery'
		},

		toAdd() {
			this.$u.route({
				url: '/pages/manage/privatesea/add',
			})
		},

		toEdit(id) {
			this.$u.route({
				url: '/pages/manage/privatesea/edit',
				params: {
					id: id
				}
			})
		},

		async confirm() {
			let result;
			if (this.action === 'recovery') {
				result = await this.$u.api.manage.privateseaRecovery({
					id: this.id,
					adminid: this.LoginAdmin.id,
				})
			} else if (this.action === 'del') {
				result = await this.$u.api.manage.privateseaDel({
					id: this.id,
					adminid: this.LoginAdmin.id,
				})
			}
			this.handleResult(result)
			this.show = false
		},

		handleResult(result) {
			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						this.getData();
					}
				});
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				});
			}
			this.show = false;
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
