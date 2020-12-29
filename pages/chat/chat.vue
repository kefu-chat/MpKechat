<template>
	<view class="container">
		<view class="tui-chat-content">
			<tui-loadmore v-if="loadding" :index="3" type="primary" text=" "></tui-loadmore>
			<view v-for="(value, key) in messageList" :key=key>
				<view class="tui-chat-center">
					<uni-dateformat :date="value[0].created_at" format="yyyy-MM-dd hh:mm"></uni-dateformat>
				</view>
				<view v-for="(item,index) in value" :key="index">
					<view :class="item.sender_type_text =='visitor'?'tui-chat-left':'tui-chat-right'">
						<image :src="item.sender.avatar ? item.sender.avatar : 'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'"
						 class="tui-user-pic tui-left" v-if="item.sender_type_text =='visitor'"></image>
						<view class="tui-chatbox" :class="item.sender_type_text =='visitor'?'tui-chatbox-left':'tui-chatbox-right'" v-if="item.type == 1">{{item.content}}</view>
						<image @click="previewImage(item.content)" :src="item.content" class="tui-chatbox" :class="item.sender_type_text =='visitor'?'tui-chatbox-left':'tui-chatbox-right'"
						 v-if="item.type == 2" />
						<image :src="item.sender.avatar ? item.sender.avatar : 'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'"
						 class="tui-user-pic tui-left" v-if="item.sender_type_text !='visitor'"></image>
					</view>
				</view>
			</view>
		</view>
		<t-chat-bar :conversation-id='conversationId' @messageCreated="messageSent" v-if="showTchatbar"></t-chat-bar>
	</view>
</template>

<script>
	import tChatBar from '@/components/views/t-chat-bar/t-chat-bar';
	import tui from '../../common/httpRequest.js';
	import utils from '../../utils/util.js';

	export default {
		components: {
			tChatBar
		},
		data() {
			return {
				loadding: false,
				show: false,
				has_previous: false,
				messageList: {},
				conversationId: null,
				showTchatbar: false,
			};
		},
		onLoad: function(options) {
			const socketLoop = setInterval(() => {
				if (tui.laravelEcho) {
					if (!Object.keys(options).indexOf('id') && location && location.hash) {
						const id = location.hash.split('?')[1].match(/[\W]?id=([^\?^\&]+)/)[1];
						options = {
							id
						};
					}
					this.getChatDetail(options.id);
					clearInterval(socketLoop);
				}
			}, 100)
		},
		beforeDestroy() {
			const channel = `conversation.${this.conversationId}`;
			tui.chatSocket = tui.laravelEcho.leave(channel);
		},
		onNavigationBarButtonTap(e) {
			console.log(e)
		},
		methods: {
			getChatDetail: function(id) {
				this.conversationId = id;
				this.messageList = {}
				const messageList = {}
				tui.request('api/conversation/' + id + '/messages', 'get').then(res => {
					if (res.success) {
						uni.setNavigationBarTitle({
							title: res.data.conversation.visitor.name + (res.data.conversation.online_status ? '' : '(已离线)')
						});
						this.has_previous = res.data.has_previous;
						for (const i of res.data.messages) {
							if (i.created_at) {
								const day = utils.formatDate(i.created_at);
								if (!messageList[day]) {
									messageList[day] = [];
								}
								messageList[day].push(i)
							}
						}
						this.messageList = messageList;
						this.initSocket();
						setTimeout(() => {
							this.scrollBottomFn()
						}, 200);
					}
				})
			},
			scrollBottomFn: function() {
				wx.createSelectorQuery().select('.tui-chat-content').boundingClientRect(function(rect) {
					wx.pageScrollTo({
						scrollTop: rect.height,
						duration: 0
					})
				}).exec()
			},
			messageSent(message) {
				const day = utils.formatDate(message.created_at);
				if (!this.messageList[day]) {
					this.messageList[day] = [];
				}
				this.messageList[day].push(message);
				setTimeout(() => {
					this.scrollBottomFn();
				}, 200);
				
				if (this.$forceUpdate) {
					this.$forceUpdate();
				}


			},
			previewImage(src) {
				uni.previewImage({
					current: src,
					urls: Object.values(this.messageList).flat().filter(msg => msg.type == 2).map(msg => msg.content),
				});
			},
			initSocket() {
				const channel = `conversation.${this.conversationId}`;
					tui.chatSocket = tui.laravelEcho.join(channel);

					tui.chatSocket.here(console.log)
						.joining(console.log)
						.leaving((user) => {
							// if (user.id !== this.visitor.id) {
							//   return;
							// }

							// this.conversation.online_status = false;
						})
						// .listen(".message.created", (e) => {
						//   this.messageList.push(e);
						//   setTimeout(() => {
						//     this.scrollTo();
						//   }, 200);
						// })
						.listenForWhisper("message", (message) => this.messageSent(message))
					this.showTchatbar = true;

			}
		},
		onPageScroll(e) {
			if (!this.has_previous) {
				return
			};
			if (e.scrollTop == 0 && !this.loadding) {
				this.loadding = true;
				setTimeout(() => {
					this.show = true;
					this.loadding = false;
				}, 1000);
			}
		}
	};
</script>

<style>
	.container {
		padding-left: 20rpx;
		padding-right: 20rpx;
		padding-bottom: 146rpx;
		box-sizing: border-box;
	}

	/*chatbox*/
	.tui-chat-content {
		width: 100%;
	}

	.tui-chatbox {
		max-width: 66%;
		border-radius: 10rpx;
		position: relative;
		padding: 20rpx 22rpx;
		font-size: 32rpx;
		color: #333;
		word-break: break-all;
		word-wrap: break-word;
	}

	.tui-chatbox::before {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		top: 20rpx;
		border: 16rpx solid;
	}

	.tui-chatbox-left {
		background: #fff;
		border: 1rpx solid #fff;
		display: inline-block;
	}

	.tui-chatbox-left::before {
		right: 100%;
		border-color: transparent #fff transparent transparent;
	}

	.tui-chatbox-right {
		background: #a0d5f3;
		border: 1rpx solid #a0d5f3;
	}

	.tui-chatbox-right::before {
		left: 100%;
		border-color: transparent transparent transparent #a0d5f3;
	}

	/*chatbox*/

	.tui-chat-left,
	.tui-chat-right {
		display: flex;
		align-items: flex-start;
		padding-top: 36rpx;
	}

	.tui-user-pic {
		width: 80rpx;
		height: 80rpx;
		flex-shrink: 0;
		border-radius: 50%;
		display: block;
	}

	.tui-left {
		margin-left: 26rpx;
	}

	.tui-chat-left .tui-left {
		margin-right: 13px;
	}

	.tui-right {
		margin-right: 26rpx;
	}

	.tui-chat-right {
		justify-content: flex-end;
	}

	.tui-chat-center {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 28rpx;
		font-size: 28rpx;
		color: #666;
		padding-top: 36rpx;
	}

	.tui-label {
		display: inline-block;
		background: rgba(0, 0, 0, 0.4);
		color: #fff;
		font-size: 24rpx;
		line-height: 24rpx;
		margin-top: 36rpx;
		padding: 12rpx 16rpx;
		text-align: center;
		border-radius: 8rpx;
		margin-left: 50%;
		transform: translateX(-50%);
	}

	.tui-img-chatbox {
		position: relative;
	}

	.tui-img-chatbox::after {
		content: '';
		position: absolute;
		height: 200%;
		width: 200%;
		border: 1rpx solid #eaeef1;
		transform-origin: 0 0;
		-webkit-transform-origin: 0 0;
		-webkit-transform: scale(0.5);
		transform: scale(0.5);
		left: 0;
		top: 0;
		border-radius: 20rpx;
	}

	.tui-chat-img {
		max-width: 200rpx;
		/* min-height: 80rpx; */
		display: block;
		border-radius: 10rpx;
	}

	.tui-chat-flex {
		display: flex;
		align-items: center;
	}

	.tui-flex-center {
		display: flex;
		align-items: center;
	}

	.tui-chat-voice {
		width: 40rpx;
		height: 40rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-rotate {
		transform: rotate(180deg);
	}

	.tui-chat-fail {
		width: 50rpx;
		height: 50rpx;
		display: block;
		flex-shrink: 0;
	}

	.tui-mr {
		margin-right: 16rpx;
	}

	.tui-ml {
		margin-left: 16rpx;
	}

	.tui-flex-end {
		justify-content: flex-end;
	}

	.tui-flex-reverse {
		flex-direction: row-reverse;
	}
</style>
