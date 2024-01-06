<template>
	<view class="content">
		<u-cell-group>
			<u-swipe-action v-for="item in visitList" :key="item.id">
				<u-swipe-action-item :options="options2" @click="changeOperation" :name="item.id">
					<view class="swipe-action u-border-top u-border-bottom">
						<view class="swipe-action__content">
							<u-cell :title="'回访内容:'+item.content"
									:value="'用户昵称:'+item.business.nickname"
									:label="'创建时间:'+item.createtime_text"
									center></u-cell>
						</view>
					</view>
				</u-swipe-action-item>
			</u-swipe-action>
		</u-cell-group>
		<u-button @click="toAdd" :customStyle="addBtnStyle" color="#19BC9C" type="success">添加回访记录</u-button>
		<u-modal :show="show" :content='content' :showCancelButton="true" @confirm="confirm"
				 @cancel="show = false"></u-modal>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			visitList: [],
			show: false,
			title: '删除',
			content: '确定删除该回访记录？',
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
			},
			options2: [{
				text: '编辑',
				id: 'edit',
				style: {
					backgroundColor: '#3c9cff'
				}
			}, {
				text: '删除',
				id: 'del',
				style: {
					backgroundColor: '#f56c6c'
				}
			}],
		};
	},
	methods: {
		async getData() {
			let result = await this.$u.api.manage.visitIndex({
				adminid: this.LoginAdmin.id,
			})
			if (result.code === 1) {
				this.visitList = result.data
			} else {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				})
			}
		},

		changeOperation(e) {
			if (e.index === 0) {
				uni.navigateTo({
					url: '/pages/manage/visit/edit?id=' + e.name,
				})
			} else {
				this.id = e.name
				this.getDelete()
			}
		},

		getDelete() {
			this.show = true
			this.title = '删除'
			this.content = '确定删除该回访记录？'
			this.action = 'del'
		},

		toAdd() {
			this.$u.route({
				url: '/pages/manage/visit/add',
			})
		},

		async confirm() {
			if (this.action === 'del') {
				let result = await this.$u.api.manage.visitDel({
					id: this.id,
					adminid: this.LoginAdmin.id,
				})
				console.log(result.code);

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
				this.show = false
			}

		},

		onShow() {
			let AuthStatus = this.$u.auth.check()
			if (AuthStatus === false) return
			this.LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {}
			this.getData()
		},
	}
}
</script>

<style>

</style>
