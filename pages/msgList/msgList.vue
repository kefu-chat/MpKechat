<template>
	<view v-if="wxLogined">
		<view class="mycontainer">
			<view class="top-container">
				<image class="bg-img" src="/static/images/my/mine_bg_3x.png"></image>
				<view @tap="logout" class="logout" hover-class="opcity" :hover-stay-time="150">
					<image class="logout-img" src="/static/images/my/icon_out_3x.png" v-show="isLogin"></image>
					<text class="logout-txt" v-show="isLogin">退出</text>
				</view>
				<view v-show="!isLogin" class="user-wrapper">
					<navigator url="/pages/common/login/login" hover-class="opcity" :hover-stay-time="150" class="user">
						<open-data class="avatar-img"  type="userAvatarUrl"></open-data>
						<open-data class="user-info-mobile"  type="userNickName"></open-data>
					</navigator>
				</view>
				<view v-show="isLogin" class="user">
					<image class="avatar-img" src="/static/images/my/mine_def_touxiang_3x.png"></image>
					<view class="user-info-mobile">
						<text>{{ mobile }}</text>
						<view class="edit-img" hover-class="opcity" :hover-stay-time="150" @tap="edit">
							<image src="/static/images/my/mine_icon_bianji_3x.png"></image>
						</view>
					</view>
				</view>
			</view>
		
			<view class="middle-container">
				<view @tap="tapEvent" data-index="1" class="middle-item" hover-class="opcity" :hover-stay-time="150">
					<image class="ticket-img" src="/static/images/my/icon_thorui_3x.png"></image>
					<text class="middle-tag">Thor UI</text>
				</view>
				<view @tap="github" class="middle-item" hover-class="opcity" :hover-stay-time="150">
					<image class="car-img" src="/static/images/my/github_3x.png"></image>
					<text class="middle-tag">GitHub</text>
				</view>
			</view>
		
			<view class="bottom-container">
				<view class="ul-item">
					<view @tap="tapEvent" data-index="2" data-key="加油站" class="item" hover-class="opcity" :hover-stay-time="150">
						<image class="item-img" src="/static/images/my/mine_icon_jiayouzhan_3x.png"></image>
						<text class="item-name">加油站</text>
					</view>
					<view @tap="tapEvent" data-index="2" data-key="停车场" class="item" hover-class="opcity" :hover-stay-time="150">
						<image class="item-img" src="/static/images/my/mine_icon_tingche_3x.png"></image>
						<text class="item-name">停车场</text>
					</view>
					<view @tap="tapEvent" data-index="2" data-key="充电桩" class="item" hover-class="opcity" :hover-stay-time="150">
						<image class="item-img" src="/static/images/my/mine_icon_chongdian_3x.png"></image>
						<text class="item-name">充电桩</text>
					</view>
				</view>
				<view class="ul-item">
					<view @tap="previewReward" class="item" hover-class="opcity" :hover-stay-time="150">
						<image class="item-img" src="/static/images/my/reward.png"></image>
						<text class="item-name">赞赏</text>
					</view>
					<view class="item" hover-class="opcity" :hover-stay-time="150" @tap="feedback">
						<button open-type="feedback" class="btn-feedback"></button>
						<image class="item-img" src="/static/images/my/feedback.png"></image>
						<text class="item-name">反馈</text>
					</view>
					<view @tap="tapEvent" data-index="3" class="item" hover-class="opcity" :hover-stay-time="150">
						<image class="item-img" src="/static/images/my/log.png"></image>
						<text class="item-name">日志</text>
					</view>
				</view>
			</view>
		</view>
	</view>
	<view v-else-if="wxLogined === false">
		<view v-if="is_online">
			<view class="container">
				<!--searchbox-->
        <view class="tui-searchbox">
          <view class="tui-search-input" @click="searchFocus" :class="searchFocused ? 'focused' : ''">
            <uni-icon>
              <i role="img" class="uni-icon-search" style="font-size: 13px; color: rgb(51, 51, 51);"></i>
            </uni-icon>
            <uni-input class="tui-input" :class="searchFocused ? 'focused' : ''">
              <div class="uni-input-wrapper">
                <input maxlength="140" step="" autocomplete="off" type="search" placeholder="搜索" class="uni-input-input" :class="searchFocused ? 'focused' : ''" :focus="searchFocused" @blur="searchBlur" @confirm="search">
              </div>
            </uni-input>
            <uni-icon style="display: none;">
              <i role="img" class="uni-icon-clear" style="font-size: 13px; color: rgb(188, 188, 188);"></i>
            </uni-icon>
          </view>
          <view class="tui-cancel" v-if="searchFocused" @click="searchBlur">取消</view>
        </view>
				<!--searchbox-->
			
				<block v-for="(item,index) in msgList" :key="item.id">
					<tui-list-cell @click="detail(item)" :unlined="true">
						<view class="tui-chat-item">
							<view class="tui-msg-box">
								<image :src="item.visitor.avatar?item.visitor.avatar:'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'"
								 class="tui-msg-pic" mode="widthFix"></image>
								<view class="tui-msg-item">
									<view class="tui-msg-name">{{item.visitor.name}}</view>
									<view class="tui-msg-content">{{item.last_message.sender_id == tui.userId() ?'你':item.last_message.sender.name}}: {{item.last_message.type==2?'[图片]':item.last_message.content}}</view>
								</view>
							</view>
							<view class="tui-msg-right tui-right-dot">
								<uni-dateformat style="width: 90px; display: block; right: 15px; position: absolute;" :date="item.last_reply_at"
								 format="yyyy-MM-dd hh:mm" :threshold="[60000, 36000000000]"></uni-dateformat>
								<tui-badge type="danger" class="badge" dot="true" v-if="item.hasNotRead"></tui-badge>
							</view>
						</view>
					</tui-list-cell>
				</block>
				<view class="tui-safearea-bottom"></view>
			</view>
		</view>
		<view v-if="!is_online" class="container">
			<view class="tui-bg-box">
				<image src="/static/images/login/bg_login.png" class="tui-bg-img"></image>
				<image src="/static/images/my/mine_def_touxiang_3x.png" class="tui-photo"></image>
				<view class="tui-login-name">登录</view>
			</view>
			<form :report-submit="true" @submit="formLogin">
				<view class="tui-login-from">
					<view class="tui-line-cell">
						<tui-icon name="mail" :size="20" color="#6d7a87"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" name="email" placeholder="请输入邮箱" maxlength="64" v-model="email" type="text" />
					</view>
					<view class="tui-line-cell tui-top28">
						<tui-icon name="pwd" :size="20" color="#6d7a87"></tui-icon>
						<input placeholder-class="tui-phcolor" class="tui-input" name="password" placeholder="请输入密码" maxlength="32" />
						<tui-button width="182rpx" height="56rpx" :size="24" :type="type" shape="circle" :plain="true" :disabled="disabled" @click="btnSend">{{ btnText }}</tui-button>
					</view>
					<button class="tui-button-primary tui-btn-submit" hover-class="tui-button-hover" form-type="submit">登录</button>
					<button class="tui-button-primary" style="margin-top:30rpx;background:#2ea44f" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo"  hover-class="tui-button-hover">微信登录</button>
					<view class="tui-protocol" hover-class="opcity" :hover-stay-time="150">
						点击"登录"即表示已同意
						<text class="tui-protocol-red" @tap="protocol">《用户协议》</text>
					</view>
				</view>
			</form>
		</view>	
	</view>
	
</template>

<script>
	import tui from '@/common/httpRequest.js'
	import subscribe from '@/common/subscribe.js'
	export default {
		data() {
			return {
				current: 0,
				conversationList: [],
				searchFocused: false,
				keyword: '',
				msgList: [],
				token: null,
				is_online:tui.is_online,
				wxLogined: uni.getStorageSync("wxLogined") || false,
			}
		},
		mounted() {
			const timeout = setInterval(() => {
				if (tui.getToken() && tui.laravelEcho) {
					this.getData();
					// if(this.is_online){
					// 	uni.setNavigationBarTitle({
					// 		title:'消息'
					// 	})
					// }
					console.log('institutionId', tui.institutionId());
					console.log('userid', tui.userId());
					clearInterval(timeout);
				}
			}, 100)
		},
		methods: {
			getData: function() {
				tui.request('api/conversation/list?type=active' + (this.keyword ? ('&keyword=' + this.keyword) : ''), 'get',).then(res => {
					if (res.success) {
						this.conversationList = res.data.conversations;
						this.unAssignedChannel();
						this.assignedChannel();
					}
				})
			},
			search: function() {
				uni.navigateTo({
					url: '../../news/search/search'
				})
			},
			detail: function(item) {
				subscribe(() => {
					item.hasNotRead = false;
					this.$forceUpdate();
					uni.navigateTo({
						url: '../chat/chat?id=' + item.id,
					})

				});
			},
			unAssignedChannel: function() {
				tui.laravelEcho.join(`institution.${tui.institutionId()}`)
					.listen(`.conversation.created`, (conversation) => {
						for (const i of this.conversationList) {
							if (i.id === conversation.conversation_id) {
								return;
							}
						}
						this.conversationList.unshift(conversation);
					})
					.listen(`.message.created`, (message) => {
						this.conversationList.filter(v => {
							if (v.id === message.conversation_id) {
								v.last_message = message;
								if (message.sender_type_text === 'visitor') {
									v.hasNotRead = true;
								}
							}
						});
					})
			},
			assignedChannel: function() {
				tui.laravelEcho.join(`institution.${tui.institutionId()}.assigned.${tui.userId()}`)
					.listen(`.conversation.created`, (conversation) => {
						for (const i of this.conversationList) {
							if (i.id === conversation.conversation_id) {
								return;
							}
						}
						this.conversationList.unshift(conversation);
					})
					.listen(`.message.created`, (message) => {
						this.conversationList.filter(v => {
							if (v.id === message.conversation_id) {
								v.last_message = message;
								if (message.sender_type_text === 'visitor') {
									v.hasNotRead = true;
								}
							}
						});
					})
			},
			searchFocus() {
				this.searchFocused = true;
			},
			searchBlur() {
				this.searchFocused = false;
			},
			search(evt) {
				this.keyword = evt.detail.value;
				this.getData();
        this.searchFocused = false;
      },
			onGotUserInfo(res){
				console.log(res)
				uni.showLoading({
					title:'登陆中'
				})
				setTimeout(()=>{
					uni.hideLoading();
					uni.setStorageSync("wxLogined", true)
					this.wxLogined = true;
				},1000)
			},
			edit() {
				this.tui.toast('功能开发中~');
			},
			tapEvent: function(e) {
				let index = e.currentTarget.dataset.index;
				let url = '';
				if (index == 1) {
					url = '/pages/common/about/about';
				} else if (index == 2) {
					let key = e.currentTarget.dataset.key;
					url = '/pages/index/maps/maps?key=' + key;
					// #ifdef MP-QQ
					this.tui.toast('功能开发中~');
					return;
					// #endif
				} else {
					url = '/pages/common/log/log';
				}
				uni.navigateTo({
					url: url
				});
			},
			github: function() {
				// #ifdef APP-PLUS || MP
				const that = this;
				uni.setClipboardData({
					data: 'https://github.com/dingyong0214/ThorUI-uniapp',
					success(res) {
						uni.getClipboardData({
							success(res) {
								that.tui.toast('链接已复制', 2000, true);
							}
						});
					}
				});
				// #endif
			
				// #ifdef H5
				location.href = 'https://github.com/dingyong0214/ThorUI-uniapp';
				// #endif
			},
			previewReward: function() {
				uni.previewImage({
					urls: ['https://thorui.cn/img/reward.jpg']
				});
			},
			feedback() {
				// #ifdef H5
				location.href = 'https://www.thorui.cn/';
				// #endif
				// #ifdef MP-ALIPAY
				uni.navigateTo({
					url: '/pages/my/feedback/feedback'
				});
				// #endif
			}
		},
		onPullDownRefresh: function() {
			this.getData();
			uni.stopPullDownRefresh();
		}
	}
</script>

<style>
	/*tabbar*/

	.tui-tabbar {
		width: 100%;
		position: fixed;
		display: flex;
		align-items: center;
		justify-content: space-between;
		z-index: 99999;
		background-color: #fff;
		height: 100rpx;
		left: 0;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.tui-safearea-bottom {
		width: 100%;
		height: env(safe-area-inset-bottom);
	}

	.tui-tabbar::before {
		content: '';
		width: 100%;
		border-top: 1rpx solid #d2d2d2;
		position: absolute;
		top: 0;
		left: 0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
	}

	.tui-tabbar-item {
		flex: 1;
		width: 25%;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
		font-size: 24rpx;
		color: #666;
		height: 80rpx;
	}

	.tui-ptop-4 {
		padding-top: 4rpx;
	}

	.tui-scale {
		font-weight: bold;
		transform: scale(0.8);
		transform-origin: center 100%;
		line-height: 30rpx;
	}

	.tui-item-active {
		color: #00c0fb !important;
	}

	/*tabbar*/

	/*searchbox*/

	.tui-searchbox {
		width: 100%;
		height: 100rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.tui-search-input {
		width: 100%;
		height: 72rpx;
		background: #fafafa;
		border-radius: 36rpx;
		font-size: 30rpx;
		color: #A8ABB8;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.tui-search-text {
		padding-left: 16rpx;
	}

	/*searchbox*/

	.tui-chat-item {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-msg-box {
		display: flex;
		align-items: center;
	}

	.tui-msg-pic {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: block;
		margin-right: 24rpx;
	}

	.tui-msg-item {
		max-width: 500rpx;
		min-height: 80rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.tui-msg-name {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 34rpx;
		line-height: 1;
		color: #262b3a;
	}

	.tui-msg-content {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 28rpx;
		line-height: 1;
		color: #9397a4;
	}

	.tui-msg-right {
		max-width: 120rpx;
		height: 88rpx;
		margin-left: auto;
		text-align: right;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-end;
	}

	.tui-msg-right.tui-right-dot {
		height: 76rpx;
		padding-bottom: 10rpx;

	}

	.tui-msg-time {
		width: 100%;
		font-size: 24rpx;
		line-height: 24rpx;
		color: #9397a4;
	}

	.badge {
		margin-top: 60rpx;
		margin-right: 20rpx;
	}

	.tui-cancel {
		color: #888;
		font-size: 14px;
		padding-left: 15px;
		-webkit-flex-shrink: 0;
		flex-shrink: 0;
	}
	.uni-input-input {
		width: 50px;
	}
	.uni-input-input.focused {
		width: 100%;
	}
	.tui-input.focused, .tui-search-input.focused {
		width: 85%;
  }
	.badge{
		margin-top:60rpx;
		margin-right: 20rpx;
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
	.top-container {
		height: 440rpx;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	
	.bg-img {
		position: absolute;
		width: 100%;
		height: 440rpx;
	}
	
	.logout {
		width: 110rpx;
		height: 36rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		margin: 42rpx 0 24rpx 32rpx;
		position: relative;
		z-index: 2;
	}
	
	.logout-img {
		width: 36rpx;
		height: 36rpx;
		margin-right: 11rpx;
	}
	
	.logout-txt {
		font-size: 28rpx;
		color: #fefefe;
		line-height: 28rpx;
	}
	
	.user-wrapper {
		display: flex;
		justify-content: center;
		position: relative;
		z-index: 2;
	}
	
	.user {
		display: flex;
		flex-direction: column;
		justify-content: center;
		position: relative;
		z-index: 2;
	}
	
	.avatar-img {
		overflow: hidden;
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		align-self: center;
	}
	
	.user-info {
		display: flex;
		flex-direction: row;
		margin-top: 30rpx;
		align-items: center;
	}
	
	.user-info-mobile {
		margin-top: 30rpx;
		position: relative;
		font-size: 28rpx;
		color: #fefefe;
		line-height: 28rpx;
		align-self: center;
		padding: 0 50rpx;
	}
	
	.edit-img {
		position: absolute;
		width: 42rpx;
		height: 42rpx;
		right: 0;
		bottom: -4rpx;
	}
	
	.edit-img>image {
		width: 42rpx;
		height: 42rpx;
		padding-left: 25rpx;
	}
	
	.middle-container {
		height: 138rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
		border-radius: 10rpx;
		background-color: #ffffff;
		margin: -30rpx 30rpx 26rpx 30rpx;
		box-shadow: 0 15rpx 10rpx -15rpx #efefef;
		position: relative;
		z-index: 2;
	}
	
	.middle-item {
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	
	.ticket-img {
		width: 80rpx;
		height: 80rpx;
		margin-left: 65rpx;
	}
	
	.middle-tag {
		font-size: 28rpx;
		color: #333333;
		line-height: 28rpx;
		font-weight: bold;
		padding-left: 22rpx;
	}
	
	.car-img {
		width: 80rpx;
		height: 80rpx;
		margin-left: 97rpx;
	}
	
	.bottom-container {
		height: 334rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 40rpx 74rpx 40rpx 95rpx;
		margin: 0 30rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
		box-sizing: border-box;
		box-shadow: 0 0 10rpx #efefef;
	}
	
	.ul-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	
	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}
	
	.item-img {
		width: 64rpx;
		height: 64rpx;
	}
	
	.item-name {
		padding-top: 13rpx;
		font-size: 24rpx;
		color: #666666;
		min-width: 80rpx;
		text-align: center;
	}
	
	.btn-feedback {
		background: transparent !important;
		position: absolute;
		height: 100%;
		width: 100%;
		left: 0;
		top: 0;
		border: 0;
	}
	
	.btn-feedback::after {
		border: 0;
	}
</style>
