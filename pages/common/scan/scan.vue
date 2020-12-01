<template>
	<view class="container">
		<view class="tui-bg-box">
			<image src="/static/images/login/bg_login.png" class="tui-bg-img"></image>
			<image src="/static/images/my/mine_def_touxiang_3x.png" class="tui-photo"></image>
			<view class="tui-login-name">客服恰</view>
		</view>
		<view>
			<view class="tui-login-from">
				<button class="tui-button-primary tui-btn-submit" hover-class="tui-button-hover" disabled="disabled" v-if="loading">请稍等...</button>
				<button class="tui-button-primary tui-btn-submit" hover-class="tui-button-hover" @click="bind()" v-if="!loading">绑定</button>
				<view class="tui-protocol" hover-class="opcity" :hover-stay-time="150">
					点击"绑定"即表示已同意
					<text class="tui-protocol-red" @tap="protocol">《用户协议》</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
const util = require('@/utils/util.js');
const form = require('@/components/common/tui-validation/tui-validation.js');

export default {
	data() {
		return {
			disabled: false,
			btnText: '获取验证码',
			mobile: '',
			type: 'primary',
			code: '',
			data:null,
			loading: true,
			option: {
				user: null,
				sign: null,
			}
		};
	},
	onLoad: function (option) {
		this.loading = true;
		uni.showNavigationBarLoading();
		
		// if (option.q && (!option.user || !option.sign)) {
		// 	let url = new URL(decodeURIComponent(option.q));
		// 	url.searchParams.forEach((v, k) => {
		// 		option[k] = v;
		// 	});
		// }
		this.option = option;
		uni.request({
			url: this.tui.interfaceUrl() + 'api/security/binding/wechat/prepare',
			data: option,
			method: 'POST',
			complete: () => {
				uni.hideNavigationBarLoading();
			},
			success: ({data: res}) => {
				console.log(res)
				if (!res.success) {
					return uni.showModal({
						content: res.message,
						showCancel: false,
					});
				}
				this.loading = false;
			},
			fail: () => {
				uni.showModal({
					content: '扫码绑定prepare失败',
					showCancel: false,
				});
			}
		});
	},
	mounted() {
		console.log('111')
	},
	methods: {
		bind:function(){
			uni.login({
				fail: () => {					
					uni.showModal({
						content: '登录获取code失败！',
						showCancel: false,
					});
				},
				success: ({code}) => {
					uni.showLoading();
					uni.request({
						url: this.tui.interfaceUrl() + 'api/security/binding/wechat/confirm',
						data: {...this.option, code},
						method: 'POST',
						complete: () => {
							uni.hideLoading();
						},
						success: ({data: res}) => {
							if (!res.success) {
								return uni.showModal({
									content: res.message,
									showCancel: false,
								});
							}
							uni.showModal({
								content: '绑定成功!',
								showCancel: false,
							});
						},
						fail: () => {
							uni.showModal({
								content: '绑定账户请求失败',
								showCancel: false,
							});
						}
					});
				}
			})
		},
		protocol: function() {
			uni.navigateTo({
				url: '/pages/common/protocol/protocol'
			});
		}
	}
};
</script>

<style>
page {
	background-color: #fff;
}

.tui-bg-box {
	width: 100%;
	box-sizing: border-box;
	position: relative;
	padding-top: 44rpx;
}

.tui-photo {
	height: 138rpx;
	width: 138rpx;
	display: block;
	margin: 10rpx auto 0 auto;
	border-radius: 50%;
	position: relative;
	z-index: 2;
}

.tui-login-name {
	width: 128rpx;
	height: 40rpx;
	font-size: 30rpx;
	color: #fff;
	margin: 36rpx auto 0 auto;
	text-align: center;
	position: relative;
	z-index: 2;
}

.tui-bg-img {
	width: 100%;
	height: 346rpx;
	display: block;
	position: absolute;
	top: 0;
}

.tui-login-from {
	width: 100%;
	padding: 128rpx 104rpx 0 104rpx;
	box-sizing: border-box;
}

.tui-input {
	font-size: 32rpx;
	flex: 1;
	display: inline-block;
	padding-left: 32rpx;
	box-sizing: border-box;
	overflow: hidden;
}

.tui-line-cell {
	padding: 27rpx 0;
	display: -webkit-flex;
	display: flex;
	-webkiit-align-items: center;
	align-items: center;
	position: relative;
	box-sizing: border-box;
	overflow: hidden;
}

.tui-line-cell::after {
	content: '';
	position: absolute;
	border-bottom: 1rpx solid #e0e0e0;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 0;
}

.tui-top28 {
	margin-top: 28rpx;
}

.tui-btn-class {
	width: 196rpx !important;
	height: 54rpx !important;
	border-radius: 27rpx !important;
	font-size: 28rpx !important;
	padding: 0 !important;
	line-height: 54rpx !important;
}

.tui-btn-submit {
	margin-top: 100rpx;
}

.tui-protocol {
	color: #333;
	font-size: 24rpx;
	text-align: center;
	width: 100%;
	margin-top: 29rpx;
}

.tui-protocol-red {
	color: #f54f46;
}
</style>
