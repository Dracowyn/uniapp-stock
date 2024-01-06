<template>
	<view class="container">
		<u-grid
			:border="true"
			@click="changeGrid"
			col="2"
			:customStyle="gridStyle"
		>
			<u-grid-item
				:name="baseListItem.id"
				:customStyle="itemStyle"
				v-for="(baseListItem, index) in baseList"
				:key="index"
			>
				<u-icon
					:customStyle="iconStyle"
					:name="baseListItem.name"
					:size="40"
				/>
				<text
					class="grid-text"
				>{{ baseListItem.title }}
				</text>
			</u-grid-item>
		</u-grid>
	</view>
</template>

<script>
export default {
	data() {
		return {
			baseList: [
				{
					id: 1,
					name: 'more-circle-fill',
					title: '客户来源'
				},
				{
					id: 2,
					name: 'account-fill',
					title: '客户公海'
				},
				{
					id: 3,
					name: 'account',
					title: '客户私海'
				},
				{
					id: 4,
					name: 'plus-people-fill',
					title: '领取记录'
				},
				{
					id: 5,
					name: 'server-fill',
					title: '回访记录'
				},
				{
					id: 6,
					name: 'trash-fill',
					title: '客户回收站'
				},
				{
					id: 7,
					name: 'order',
					title: '课程订单'
				},
				{
					id: 8,
					name: 'file-text-fill',
					title: '商品订单'
				},
			],
			gridStyle: {
				borderBottom: '1px solid #dadbde'
			},
			itemStyle: {
				padding: '2em 0em'
			},
			iconStyle: {
				marginBottom: '.5em',
				color: '#19BC9C',
			},
		}
	},
	methods: {
		changeGrid(name) {
			let authStatus = this.$u.auth.check();
			console.log(authStatus);
			if (authStatus === false) {
				return;
			}
			switch (name) {
				case 1:
					this.$u.route('pages/manage/source/index');
					break;
				case 2:
					this.$u.route('pages/manage/highsea/index');
					break;
				case 3:
					this.$u.route('pages/manage/privatesea/index');
					break;
				case 4:
					this.$u.route('pages/manage/receive/index');
					break;
				case 5:
					this.$u.route('pages/manage/visit/index');
					break;
			}
		}
	}
}
</script>

<style>

</style>
