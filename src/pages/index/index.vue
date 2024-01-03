<template>
	<view class="container">
		<view class="title">数量统计</view>
		<view class="achieve">
			<view class="order bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="order"/>
					总订单数
				</view>
				<view class="count">{{ total.orderCount }} 单</view>
			</view>
			<view class="sale bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="shopping-cart"/>
					总销售额
				</view>
				<view class="money">{{ total.orderMoney }} 元</view>
			</view>
			<view class="profit bg-abstract">
				<view class="label">
					<u-icon class="icon" size="30" color="#fff" name="man-add"/>
					总客户量
				</view>
				<view class="count">{{ total.businessCount }} 个</view>
			</view>
		</view>

		<view class="title">客户分析</view>
		<view class="ChartsBox">
			<qiun-data-charts type="column" :opts="businessOpts" :chartData="businessData"/>
		</view>

		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
export default {
	data() {
		return {
			LoginAdmin: uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {},
			month: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
			total: {
				orderCount: 0,
				orderMoney: 0,
				businessCount: 0
			},
			businessData: {},
			businessOpts: {
				color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
				padding: [15, 15, 0, 5],
				enableScroll: false,
				legend: {},
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					data: [
						{
							min: 0
						}
					]
				},
				extra: {
					column: {
						type: "group",
						width: 30,
						activeBgColor: "#000000",
						activeBgOpacity: 0.08
					}
				}
			},
		}
	},
	methods: {
		async getTotalData() {
			let result = await this.$u.api.controller.getTotal({adminid: this.LoginAdmin.id});

			if (result.code === 0) {
				this.$refs.uToast.show({
					type: 'error',
					message: result.msg
				});

				return;
			}

			this.total = result.data;
		},
		async getBusinessData() {
			let result = await this.$u.api.controller.getBusinessData({adminid:this.LoginAdmin.id});
			setTimeout(() => {
				let res = {
					categories: this.month,
					series: [
						{
							name: "未认证",
							data: result.data.noCertification
						},
						{
							name: "已认证",
							data: result.data.certification
						}
					]
				};
				this.businessData = JSON.parse(JSON.stringify(res));
			}, 500);
		},
	},
	onShow() {
		let AuthStatus = this.$u.auth.check();

		if (AuthStatus === false) return;

		this.getBusinessData();
		this.getTotalData();
	}
}
</script>

<style>
.container {
	padding: 0 10px;
}

.title {
	font-weight: bold;
	font-size: 15px;
	padding: 15px 0;
}

.achieve {
	height: 100px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: #fff;
}

.achieve .order,
.achieve .sale,
.achieve .profit,
.global .visitor,
.global .order,
.global .sale {
	position: relative;
	height: 100%;
	border-radius: 4px;
	width: 32%;
}

.achieve .order {
	background-color: #3c9cff;
}

.achieve .sale {
	background-color: #f9ae3d;
}

.achieve .profit {
	background-color: #5ac725;
}

.achieve .count,
.global .count {
	font-size: 14px;
	font-weight: bold;
	position: absolute;
	right: 10px;
	bottom: 10px;
}

.achieve .money,
.global .money {
	font-size: 14px;
	font-weight: bold;
	position: absolute;
	right: 10px;
	bottom: 10px;
}

.money::before {
	content: "¥";
	margin-right: 2px;
	font-weight: normal;
	font-size: 14px;
}

.achieve .label,
.global .label {
	font-size: 14px;
	position: absolute;
	top: 10px;
	left: 10px;
	text-align: center;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: flex-start;
}

.achieve .label .icon,
.global .label .icon {
	margin-right: 4px;
}

.ChartsBox {
	width: 100%;
	height: 300px;
}
</style>