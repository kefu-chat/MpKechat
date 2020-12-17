/**
 * 常用方法封装 请求，文件上传等
 * @author echo. 
 **/
const io = require('libs/weapp.socket.io.js')
const Echo = require("libs/echo.js")

const tui = {
	//接口地址
	is_online: false,
	laravelEcho: null,
	institutionId: function() {
		return uni.getStorageSync("institutionId")
	},
	userId: function() {
		return uni.getStorageSync("userId")
	},
	setUserId: function(id) {
		uni.setStorageSync("userId", id)
	},
	setInstitutionId: function(id) {
		uni.setStorageSync("institutionId", id)
	},
	interfaceUrl: function() {
		// return 'http://dev.fastsupport.cn/'
		// return 'http://127.0.0.1/'
		// return 'https://kefu.ssl.digital/';
		return 'https://api.kefu.chat/'
		//return 'https://uat.thorui.cn'
		// return 'https://prod.thorui.cn'
	},
	socketUrl: function() {
		return 'https://api.kefu.chat/'
	},
	toast: function(text, duration, success) {
		uni.showToast({
			title: text || "出错啦~",
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	modal: function(title, content, showCancel, callback, confirmColor, confirmText) {
		uni.showModal({
			title: title || '提示',
			content: content,
			showCancel: showCancel,
			cancelColor: "#555",
			confirmColor: confirmColor || "#5677fc",
			confirmText: confirmText || "确定",
			success(res) {
				if (res.confirm) {
					callback && callback(true)
				} else {
					callback && callback(false)
				}
			}
		})
	},
	isAndroid: function() {
		const res = uni.getSystemInfoSync();
		return res.platform.toLocaleLowerCase() == "android"
	},
	isPhoneX: function() {
		const res = uni.getSystemInfoSync();
		let iphonex = false;
		let models = ['iphonex', 'iphonexr', 'iphonexsmax', 'iphone11', 'iphone11pro', 'iphone11promax']
		const model = res.model.replace(/\s/g, "").toLowerCase()
		if (models.includes(model)) {
			iphonex = true;
		}
		return iphonex;
	},
	constNum: function() {
		let time = 0;
		// #ifdef APP-PLUS
		time = this.isAndroid() ? 300 : 0;
		// #endif
		return time
	},
	delayed: null,
	login: async function() {
		return new Promise((resolve, reject) => {

		})
	},
	/**
	 * 请求数据处理
	 * @param string url 请求地址
	 * @param string method 请求方式
	 *  GET or POST
	 * @param {*} postData 请求参数
	 * @param bool isDelay 是否延迟显示loading
	 * @param bool isForm 数据格式
	 *  true: 'application/x-www-form-urlencoded'
	 *  false:'application/json'
	 * @param bool hideLoading 是否隐藏loading
	 *  true: 隐藏
	 *  false:显示
	 */
	request: async function(url, method, postData, isDelay, isForm, hideLoading, callback) {
		//接口请求
		let loadding = false;
		tui.delayed && uni.hideLoading();
		clearTimeout(tui.delayed);
		tui.delayed = null;
		if (!hideLoading) {
			tui.delayed = setTimeout(() => {
				uni.showLoading({
					mask: true,
					title: '请稍候...',
					success(res) {
						loadding = true
					}
				})
			}, isDelay ? 1000 : 0)
		}
		return new Promise(async (resolve, reject) => {
			uni.request({
				url: tui.interfaceUrl() + url,
				data: postData,
				header: {
					'content-type': isForm ? 'application/x-www-form-urlencoded' : 'application/json',
					Authorization: 'Bearer ' + tui.getToken()
				},
				method: method, //'GET','POST'
				dataType: 'json',
				success: (res) => {
					clearTimeout(tui.delayed)
					tui.delayed = null;
					if (loadding && !hideLoading) {
						uni.hideLoading()
					}
					// if (res.data && res.data.code == 1) {
					// 	uni.clearStorageSync()
					// 	tui.modal("登录信息已失效，请重新登录", false, () => {
					// 		//store.commit("logout") 登录页面执行
					// 		uni.redirectTo({
					// 			url: '/pages/common/login/login'
					// 		})
					// 	})
					// 	return
					// }
					resolve(res.data)
				},
				fail: (res) => {
					clearTimeout(tui.delayed)
					tui.delayed = null;
					tui.toast("网络不给力，请稍后再试~")
					reject(res)
				}
			})
		})
	},
	/**
	 * 上传文件
	 * @param string url 请求地址
	 * @param string src 文件路径
	 */
	uploadFile: function(url, src) {
		uni.showLoading({
			title: '请稍候...'
		})
		return new Promise((resolve, reject) => {
			const uploadTask = uni.uploadFile({
				url: tui.interfaceUrl() + url,
				filePath: src,
				name: 'imageFile',
				header: {
					Authorization: tui.getToken()
				},
				formData: {
					// sizeArrayText:""
				},
				success: function(res) {
					uni.hideLoading()
					let d = JSON.parse(res.data.replace(/\ufeff/g, "") || "{}")
					if (d.code % 100 == 0) {
						//返回图片地址
						let fileObj = d.data;
						resolve(fileObj)
					} else {
						that.toast(res.msg);
					}
				},
				fail: function(res) {
					reject(res)
					that.toast(res.msg);
				}
			})
		})
	},
	tuiJsonp: function(url, callback, callbackname) {
		// #ifdef H5
		window[callbackname] = callback;
		let tuiScript = document.createElement("script");
		tuiScript.src = url;
		tuiScript.type = "text/javascript";
		document.head.appendChild(tuiScript);
		document.head.removeChild(tuiScript);
		// #endif
	},
	//设置用户信息
	setUserInfo: function(mobile, token) {
		//uni.setStorageSync("thorui_token", token)
		uni.setStorageSync("thorui_mobile", mobile)
	},
	setToken(token) {
		uni.setStorageSync("thorui_token", token)
	},
	//获取token
	getToken() {
		return uni.getStorageSync("thorui_token")
	},
	//判断是否登录
	isLogin: function() {
		return uni.getStorageSync("thorui_mobile") ? true : false
	},
	//跳转页面，校验登录状态
	href(url, isVerify) {
		if (isVerify && !tui.isLogin()) {
			uni.navigateTo({
				url: '/pages/common/login/login'
			})
		} else {
			uni.navigateTo({
				url: url
			});
		}
	},
	login: function(call) {
		uni.login({
			success(res) {
				if (res.code) {
					//发起网络请求
					uni.request({
						url: tui.interfaceUrl() + 'api/login-via-miniapp',
						data: {
							code: res.code
						},
						method: 'post',
						success: (res) => {
							tui.is_online = res.data.is_online || res.data.data.is_online;
							if (!tui.is_online) {
								uni.navigateTo({
									url: '/pages/blank/blank'
								});
								return;
							}
							if (res.data.success) {
								if (res.data.data.token) {
									console.log('23232323232323')
									tui.setInstitutionId(res.data.data.institution.id);
									tui.setUserId(res.data.data.user.id);
									tui.setToken(res.data.data.token);
									tui.initLaravelEcho(res.data.data.token);
									if (call) call();
								}
							} else if (res.data.code === 401) {
								if (getCurrentPages && getCurrentPages().reverse()[0] && getCurrentPages().reverse()[0].route &&
									getCurrentPages().reverse()[0].route != 'pages/common/scan/scan')
									uni.navigateTo({
										url: '/pages/common/bind/bind'
									});
							}
						}
					})
				}
			}
		});
	},
	initLaravelEcho: function(token) {
		tui.laravelEcho = new Echo({
			broadcaster: 'socket.io',
			host: tui.socketUrl(), //地址填写实际项目的地址
			auth: {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		});
	}
}

export default tui
