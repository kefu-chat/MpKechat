<script>
	const io = require('libs/weapp.socket.io.js')
	const Echo = require("libs/echo.js")
	import tui from 'common/httpRequest.js'
	export default {
		onLaunch: function() {
			let that = this;
			uni.getProvider({
				service: 'oauth',
				success(res) {
					if (res.provider && res.provider.length) {
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
													that.initLaravelEcho(res.data.data.token);
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
					} else {
						// H5						
						uni.navigateTo({
							url: '/pages/login/h5'
						});
					}
				},
				fail(res) {
					console.log(res);
				},
			});
		},
		onShow: function() {

		},
		onHide: function() {
			//console.log('App Hide')
		},
		onError: function(err) {
			//全局错误监听
		},
		methods: {
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

	};
</script>

<style>
	/*每个页面公共css uParse为优化版本*/
	@import './common/app.css';
	/* #ifndef APP-NVUE */
	@import './components/uni/uParse/src/wxParse.css';
	/* #endif */
</style>
