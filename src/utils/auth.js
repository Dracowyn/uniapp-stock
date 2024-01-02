const install = (Vue, vm) => {
	const check = () => {
		let LoginAdmin = uni.getStorageSync('LoginAdmin') ? uni.getStorageSync('LoginAdmin') : {};

		console.log(LoginAdmin);

		if (JSON.stringify(LoginAdmin) === '{}') {
			uni.showToast({
				title: '请先登录',
				icon: 'error',
				complete: () => {
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/admin/login'
						});
					}, 1500);
				}
			});
			return true;
		}

		return true;
	}

	vm.$u.auth = {
		check
	};
}

export default {
	install
}