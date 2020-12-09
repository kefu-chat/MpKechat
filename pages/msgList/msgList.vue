<template>
	<view class="container">
		<!--searchbox-->
		<view class="tui-searchbox">
			<view class="tui-search-input" @tap="search">
				<icon type="search" size='15' color='#999'></icon>
				<text class="tui-search-text">搜索</text>
			</view>
		</view>
		<!--searchbox-->

		<block v-for="(item,index) in msgList" :key="item.id">
			<tui-list-cell @click="detail(item.id)" :unlined="true">
				<view class="tui-chat-item">
					<view class="tui-msg-box">
						<image :src="item.visitor.avatar?item.visitor.avatar:'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'" class="tui-msg-pic" mode="widthFix"></image>
						<view class="tui-msg-item">
							<view class="tui-msg-name">{{item.visitor.name}}</view>
							<view class="tui-msg-content">{{item.last_message.type==2?'[图片]':item.last_message.content}}</view>
						</view>
					</view>
					<view class="tui-msg-right tui-right-dot">
						<uni-dateformat style="width: 90px; display: block; right: 15px; position: absolute;" :date="item.last_reply_at" format="yyyy-MM-dd hh:mm" :threshold="[60000, 36000000000]"></uni-dateformat>
						<tui-badge type="danger" dot="true" v-if="item.hasNotRead"></tui-badge>
					</view>
				</view>
			</tui-list-cell>
		</block>
		<view class="tui-safearea-bottom"></view>
	</view>
</template>

<script>
	import tui from '@/common/httpRequest.js'
	export default {
		data() {
			return {
				current: 0,
				msgList: [],
				token:null
			}
		},
		mounted() {
			const timeout = setInterval(()=>{
				if(tui.getToken()){
					this.getData();
					clearInterval(timeout);
				}
			}, 100)
		},
		methods: {
			getData:function(){
				tui.request('api/conversation/list?type=active','get').then(res=>{
					if(res.success){
						this.msgList = res.data.conversations;
					}
				})
			},
			search: function() {
				uni.navigateTo({
					url: '../../news/search/search'
				})
			},
			detail: function(id) {
				uni.requestSubscribeMessage({
					tmplIds:[
						'LHgTmtQNNOiAZ8qNL9g4y3RFTOmlMUeaPNkfs5Trte8',
						'LHgTmtQNNOiAZ8qNL9g4y-7a_gzNX62chkju-eX44jc',
						'OmFBieiBSjQGgODZCmE71w1VnptOc_sMYysdaAtURGg',
					],
					success: console.log,
					fail: console.log,
					complete: () => {
						uni.navigateTo({
							url: '../chat/chat?id='+id,
						})
					},
				});
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
</style>
