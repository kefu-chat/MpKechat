<template>
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

		<block v-for="(item,index) in conversationList" :key="item.id">
			<tui-list-cell @click="detail(item)" :unlined="true">
				<view class="tui-chat-item">
					<view class="tui-msg-box">
						<image :src="item.visitor.avatar?item.visitor.avatar:'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'"
						 class="tui-msg-pic" mode="widthFix"></image>
						<view class="tui-msg-item">
							<view class="tui-msg-name">{{item.visitor.name}}</view>
							<view class="tui-msg-content">{{item.last_message.sender_id == tui.userId() ?'你':item.last_message.sender.name}}:
								{{item.last_message.type==2?'[图片]':item.last_message.content}}</view>
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
</template>

<script>
	import tui from '@/common/httpRequest.js'
	import subscribe from '@/common/subscribe.js'
	export default {
		data() {
			return {
				current: 0,
				conversationList: [],
				token: null,
				searchFocused: false,
				keyword: '',
			}
		},
		mounted() {
			const timeout = setInterval(() => {
				if (tui.getToken() && tui.laravelEcho) {
					this.getData();
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
</style>
