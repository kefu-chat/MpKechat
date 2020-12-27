<template name="zy-search">
	<view class="container">
		<view class="tui-searchbox" style="padding:0 20rpx">
			<view class="tui-search-input">
				<icon type="search" :size='13' color='#333'></icon>
				<input confirm-type="search" placeholder="请输入关键词搜索" @confirm="search(key)" @focus="doFucus"
				 placeholder-class="tui-input-plholder" class="tui-input" v-model.trim="key" @input="inputKey" />
				<icon type="clear" :size='13' color='#bcbcbc' @tap="cleanKey" v-show="key"></icon>
			</view>
			<view class="tui-cancle" @tap="cannel" v-if="isFocus">取消</view>
		</view>

		<view v-if="isFocus" class="mainContainer"  :style="{height:h}">
			<view class="tui-search-history" v-show="history.length>0 && !key">
				<view class="tui-history-header">
					<view class="tui-search-title">搜索历史</view>
					<tui-icon name="delete" :size='14' color='#333' @tap="clearHistory" class="tui-icon-delete"></tui-icon>
				</view>
				<view class="tui-history-content">
					<block v-for="(item,index) in history" :key="index">
						<tui-tag margin="0 24rpx 24rpx 0" type="gray" shape="circle" @click="keywordsClick(item)">{{item}}</tui-tag>
					</block>
				</view>
			</view>
			<view v-show="key" style="height:100%">
				<view class="tui-header">
					<view class="tui-header-left tui-noboredr">搜索 “{{key}}”</view>
				</view>
				<view class="tui-result-box">
					<view>联系人</view>
					<block v-for="(item,index) in searchResult" :key="index" style="clear: both;">
						<view class="tui-result-item" hover-class="tui-opcity" :hover-stay-time="150" @click="detail(item)"  style="clear: both;margin:5px 0;">
							<image :src="item.visitor.avatar?item.visitor.avatar:'http://localhost:4200/assets/tmp/img/random/' + (Number(index%50 )+1) +'.svg'"
							 class="visitorPic"></image>
							 <View class="visitorName">{{item.visitor.name}}</View>
						</view>
					</block>
				</view>
			</view>
		</view>


		<!-- <view class="tui-search-hot">
			<view class="tui-hot-header">
				<view class="tui-search-title">大家正在搜</view>
			</view>
			<view class="tui-hot-content">
				<block v-for="(item,index) in hot" :key="index">
					<tui-tag type="gray" shape="circle">{{item}}</tui-tag>
				</block>
			</view>
		</view> -->
	</view>

</template>

<script>
	const util = require("@/utils/util.js")
	export default {
		props: {
			list: {
				type: Array,
				default: function() {
					return {};
				},
			},
		},
		data() {
			return {
				history: uni.getStorageSync('search_cache'),
				key: "",
				showActionSheet: false,
				tips: "确认清空搜索历史吗？",
				searchResult: [],
				searchList: [],
				isFocus: false,
				h:'200px',
			}
		},
		methods: {
			doFucus: function(){
				this.isFocus = true;
				this.h = uni.getSystemInfoSync().windowHeight-uni.upx2px(50) + 'px';
				// this.$refs.main.height = 400;
			},
			cannel: function() {
				this.key = '';
				this.isFocus = false;
			},
			cleanKey: function() {
				this.key = '';
			},
			closeActionSheet: function() {
				this.showActionSheet = false
			},
			openActionSheet: function() {
				this.showActionSheet = true
			},
			itemClick: function(e) {
				let index = e.index;
				if (index == 0) {
					this.showActionSheet = false;
					this.history = []
				}
			},
			inputKey: function(e) {
				this.key = util.trim(e.detail.value);
			},
			keywordsClick(item) { //关键词搜索与历史搜索
				this.key = item;
				this.searchResult = this.list.filter(v => v.visitor.name.indexOf(item) >= 0);
			},
			clearHistory() {
				this.history = [];
				uni.setStorage({
					key: 'search_cache',
					data: []
				});
			},
			search() {
				let history = uni.getStorageSync('search_cache');
				if(!history){
					history = [];
				}
				if (history.length > 15) {
					history.splice(0, 1);
				}
				const index = history.indexOf(this.key);
				if (index >= 0) {
					history.splice(index, 1);
				}
				history.unshift(this.key);
				uni.setStorage({
					key: 'search_cache',
					data: history
				});
				this.history = history;
				this.searchResult = this.list.filter(v => v.visitor.name.indexOf(this.key) >= 0);
				console.log(this.searchResult)
			},
			detail: function(item) {
					uni.navigateTo({
						url: '/pages/chat/chat?id=' + item.id,
					})
			},
		}
	}
</script>

<style>
	page {
		color: #333;
		background: #fff;
		height: 100%;
	}

	.container {
		box-sizing: border-box;
		background: #f8f8f8;
		height: 100%;
	}

	.tui-searchbox {
		padding: 30rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
	}

	.tui-search-input {
		width: 100%;
		height: 66rpx;
		border-radius: 35rpx;
		padding: 0 30rpx;
		box-sizing: border-box;
		background: #fff;
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
	}

	.tui-input {
		flex: 1;
		color: #333;
		padding: 0 16rpx;
		font-size: 28rpx;
	}

	.tui-input-plholder {
		font-size: 28rpx;
		color: #b2b2b2;
	}

	.tui-cancle {
		color: #888;
		font-size: 28rpx;
		padding-left: 30rpx;
		flex-shrink: 0;
	}

	.tui-history-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx 0;
	}

	.tui-history-content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}

	.tui-icon-delete {
		padding: 10rpx;
	}

	.tui-search-title {
		font-size: 28rpx;
		font-weight: bold;
	}

	.tui-hot-header {
		padding: 30rpx 0;
	}

	.tui-header {
		padding: 26rpx 0;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tui-header-left {
		font-size: 30rpx;
		color: #222;
		border-left: 4rpx solid #EB0909;
		padding-left: 10rpx;
		word-break: break-all;
	}

	.tui-noboredr {
		border-left: 0 !important;
	}

	.tui-result-box {
		height:calc(100% - 20px);
		display:flex;
		font-size: 28rpx;
		flex-direction: column;
		overflow: auto;
	}

	.tui-result-item {
		padding: 14rpx 0;
	}
	.visitorPic{
		float: left;
		display: inline-block;
		width: 42px;
		height: 42px;
	}
	.visitorName{
		float: left;
		line-height: 42px;
		height: 42px;
		padding-left:15px;
	}
	.mainContainer{
		background: #fff;padding: 0 30rpx 20rpx;
	}

</style>
