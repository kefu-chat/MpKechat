<script>
	import tui from './common/httpRequest.js'
export default {
	onLaunch: function() {
		console.log(tui)
		wx.login({
		  success (res) {
		    if (res.code) {
		      //发起网络请求
			tui.request('api/login-via-miniapp','post',{code:res.code}).then(resp=>{
				console.log(resp)
			})
		    } else {
		      console.log('登录失败！' + res.errMsg)
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