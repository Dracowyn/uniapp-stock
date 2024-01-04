<template>
	<view class="content">
		<u-cell-group>
			<u-swipe-action
				v-for="item in sourceList"
				:key="item.id"
				:auto-close="true"
			>
				<u-swipe-action-item
					:options="option2"
					@click="changeOperation"
					:name="item.id"
				>
					<view class="swiper-action u-border-top u-border-bottom">
						<view class="swiper-action__content">
							<u-cell :title="item.name" center/>
						</view>
					</view>
				</u-swipe-action-item>

			</u-swipe-action>
		</u-cell-group>
		<u-button
			@click="toAdd"
			:customStyle="btnStyle"
			color="#19BC9C"
			type="success">添加
		</u-button>
		<u-modal
			:show="show"
			:title="title"
			:content='content'
			:showCancelButton="true"
			@confirm="confirm"
			@cancel="show = false"/>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			option2: [
				{
					text: '编辑',
					id: 'edit',
					style: {
						backgroundColor: '#3c9cff'
					}
				},
				{
					text: '删除',
					id: 'del',
					style: {
						backgroundColor: '#f56c6c'
					}
				}
			],
			sourceList: [],
			show: false,
			title: '删除',
			content: '确定删除该客户来源？',
			btnStyle: {
				width: '100%',
				position: 'fixed',
				bottom: '0',
			},
			LoginAdmin: uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {},
		};
	},
	methods: {
		changeOperation(name) {
			console.log('changeOperation:' + name.index);
			switch (name.index) {
				case 0:
					let id = name.name;
					this.$u.route({
						url: '/pages/manage/source/edit',
						params: {
							id: id
						}
					});
					break;
				case 1:
					this.show = true;
					this.id = name.name;
					break;
				default:
					break;
			}
		},
		toAdd() {
			this.$u.route({
				url: '/pages/manage/source/add',
			});
		},
		async confirm() {
			console.log('toDel');
			let result = await this.$u.api.manage.sourceDel({
				adminid: this.LoginAdmin.id,
				id: this.id,
			});

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
		async getData() {
			console.log('getData')
			let result = await this.$u.api.manage.sourceIndex({
				adminid: this.LoginAdmin.id,
			});

			if (result.code === 0) {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg,
				});
				return;
			}
			this.sourceList = result.data;
		},
		onLoad() {
			console.log('onLoad');
		},
		onShow() {
			console.log('onShow');
			this.getData();
		},
		onReady() {
			console.log('onReady');
		},
	},
}
</script>

<style>

</style>
