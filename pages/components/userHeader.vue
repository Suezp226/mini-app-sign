<template>
	<view class="outBox">
		<view class="infoBox">
			<!-- <view class="leftBox">
				<image src="../../static/logo.png" mode="aspectFit"></image>
			</view> -->
			<view class="rightBox">
				<view class="name">{{userInfo.name}}</view>
				<view class="phone">{{userInfo.phone}}</view>
				<view class="tag">{{userInfo.position}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {
					name: 'Suezp',
					phone: '132959329210',
					position: '销售内勤'
				}
			}
		},
		onLoad() {

		},
		methods: {
			goNextPage() {
				console.log('执行跳转')
				uni.navigateTo({
					url: '/pages/index/center?id=1&name=uniapp'
				});
			},
		}
	}
</script>

<style scoped lang="less">
	.outBox {
		padding-top: 20px;
		background-image: linear-gradient(#3fa89a, #fff);
	}
	.infoBox {
		// background-image: url(../../static/bg1.png);
		background-color: #ffffff;
		width: 95%;
		margin: 0 auto;
		color: #000;
		background-size: cover;
		background-position-x: center;
		border-radius: 5px;
		box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);
		display: flex;
		padding: 15px 0 25px 10px;
		box-sizing: border-box;

		view {
			display: inline-block;
		}

		.leftBox {
			height: 40px;
			width: 40px;
			border-radius: 30px;
			overflow: hidden;
			border: 2px solid #ffffff;

			image {
				height: 60px;
				width: 60px;
			}
		}

		.rightBox {
			position: relative;
			flex: 1;
			text-align: left;
			padding: 0 10px 0 20px;

			.name {
				display: block;
				font-size: 20px;
				font-weight: bold;
				height: 40px;
			}

			.phone {
				display: block;
				letter-spacing: 1rpx;
			}

			.tag {
				position: absolute;
				color: #fff;
				right: 20px;
				font-size: 14px;
				top: 0px;
				border-radius: 5px;
				background-color: rgb(136, 119, 163);
				text-align: center;
				padding: 6px 14px;
			}
		}
	}
</style>
