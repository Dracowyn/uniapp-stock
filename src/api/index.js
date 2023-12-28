// 默认引入模块
const files = require.context('./', true, /index.js$/);

// 集合
const modules = {};

files.keys().forEach(key => {
	if (key === './index.js') return;

	const item = files(key).default;

	const mod = {};

	// 替换路径 ./admin/index.js
	const name = key.replace(/\.\/(.*)\/index.js/, "$1");

	mod[name] = item;

	Object.assign(modules, mod);
});

const install = (Vue, vm) => {
	modules;

	// 循环存放的集合
	let api = {};

	for (let moduleName in modules) {
		if (JSON.stringify(modules[moduleName]) === '{}') {
			continue;
		}

		for (let apiName in modules[moduleName]) {
			let config = modules[moduleName][apiName];
			config.name = apiName;

			if (!config.name || !config.url) {
				continue;
			}

			// 循环时模块名没出现过就模块名初始化
			if (!api[moduleName]) {
				api[moduleName] = {};
			}

			switch (config.method.toUpperCase()) {
				case "GET":
					// $api.admin.login()
					api[moduleName][config.name] = (data = {}) => {
						return uni.$u.http.get(config.url, {params: data});
					};
					break;
				case "POST":
					api[moduleName][config.name] = (data = {}) => {
						return uni.$u.http.post(config.url, data);
					};
					break;
				case "UPLOAD":
					api[moduleName][config.name] = (data = {}) => {
						if (data.filePath) {
							return uni.$u.http.upload(config.url, data);
						} else {
							return uni.$u.http.post(config.url, data);
						}
					};
					break;
			}
		}
	}

	vm.$u.api = api;
}

export default {
	install
}