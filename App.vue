<script>
	import tui from 'common/httpRequest.js'
	export default {
		onLaunch: function() {
			let that = this;
			uni.getProvider({
				service: 'oauth',
				success(res) {
					if (res.provider && res.provider.length) {
						tui.login();
					} else {
						// H5
						uni.setStorage({
							key: 'is_online',
							data: true
						});
						tui.is_online = true
						if (!tui.getToken()) {
							uni.navigateTo({
								url: '/pages/login/h5'
							});
						}
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
