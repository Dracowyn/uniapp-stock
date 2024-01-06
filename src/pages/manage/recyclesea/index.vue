<template>
	<view class="content">
		<u-cell-group>
			<u-cell :value="item.deal_text" v-for="item in recycleseaList" :key="item.id">
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
						<u-button type="success" :customStyle="btnStyle" size="mini" text="还原"
								  @click="toRecover(item.id)"></u-button>
						<u-button
							type="error"
							:customStyle="btnStyle"
							size="mini"
							text="删除"
							@click="toDelete(item.id)"
						>
						</u-button>
					</view>
				</view>
			</u-cell>
		</u-cell-group>
		<u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm"
				 @cancel="show = false"></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			recycleseaList: [],
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
		};
	},
	methods: {
		async getData() {
			let result = await this.$u.api.manage.recycleseaIndex({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.recycleseaList = result.data
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
					complete: () => {
						this.$u.route({
							type: "navigateBack",
						});
					}
				})
			}
		},
		getInfo(id) {
			this.$u.route({
				url: '/pages/manage/recyclesea/info',
				params: {
					id: id,
				}
			});
		},

		toDelete(id) {
			this.id = id
			this.show = true
			this.title = '删除'
			this.content = '确定彻底删除该客户？'
			this.action = 'del'
		},

		toRecover(id) {
			this.id = id
			this.show = true
			this.title = '还原'
			this.content = '确定还原该客户？'
			this.action = 'recover'
		},

		async confirm() {
			let result;
			if (this.action === 'del') {
				result = await this.$u.api.manage.recycleseaDel({
					adminid: this.LoginAdmin.id,
					id: this.id,
				})
			} else if (this.action === 'recover') {
				result = await this.$u.api.manage.recycleseaRecover({
					adminid: this.LoginAdmin.id,
					id: this.id,
				})
			}
			this.handleResult(result);
			this.show = false;
		},

		handleResult(result) {
			if (result.code === 1) {
				this.$refs.uToast.show({
					type: 'success',
					message: result.msg,
					complete: () => {
						this.getData()
					}
				})
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				})
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
