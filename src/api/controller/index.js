// 引入当前目录的所有js文件
const files = require.context(".", false, /\.js$/);

// 集合
const list = {};

files.keys().forEach(key => {
	if (key === './index.js') {
		return;
	}

	// 获取每个js文件的接口
	const item = files(key).default;

	// 进行合并
	Object.assign(list, item);
});

export default list;