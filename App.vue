<script>
	// import Echo from './libs/echo';
	// import Pusher from './libs/pusher';
	import tui from 'common/httpRequest.js'
	export default {
		onLaunch: function() {
			wx.login({
			  success (res) {
			    if (res.code) {
					//发起网络请求
					wx.request({
						url: tui.interfaceUrl() + 'api/login-via-miniapp',
						data:{ code:res.code },
						method: 'post',
						success:(res)=>{
							tui.is_online = res.data.is_online;
							if (!res.data.is_online) {
								uni.navigateTo({
									url: '/pages/blank/blank'
								});
								return;
							}
							if(res.data.success){
								if(res.data.data.token){
									tui.setToken(res.data.data.token);
									uni.navigateTo({
										url: '/pages/msgList/msgList'
									});
								}
							}else if(res.data.code === 401){
								if (getCurrentPages && getCurrentPages().reverse()[0] && getCurrentPages().reverse()[0].route && getCurrentPages().reverse()[0].route != 'pages/common/scan/scan')
								uni.navigateTo({
									url: '/pages/common/bind/bind'
								});
							}
						}
					})
				}
			  }
			})
		},
		onShow: function() {

		},
		onHide: function() {
			//console.log('App Hide')
		},
		onError: function(err) {
			//全局错误监听
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
