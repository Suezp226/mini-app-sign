<template>
	<view class="content">
		<view class="bgView"></view>
		<view class="formBox">
			<!-- <view class="form-item header" >
			    <view style="width:100%;text-align:center;"></view>
			 </view> -->
			<view class="form-item">
				<view class="title">客户姓名</view>
				<input class="input" name="input" v-model="formInfo.name" placeholder="请输入..." />
			</view>
			<view class="form-item">
				<view class="title">手机号</view>
				<input class="input" name="input" v-model="formInfo.phone" placeholder="请输入..." />
			</view>
			<view class="form-item">
				<view class="title">订单号</view>
				<input class="input" name="input" v-model="formInfo.orderNum" placeholder="请输入..." />
			</view>
			<view class="form-item">
				<uni-file-picker limit="3" title="请上传订货单图片" :value="fileLists" :imageStyles="imageStyles"
					file-mediatype="image"></uni-file-picker>
			</view>
			<view class="form-item">
				<view class="title" style="flex: 1;line-height: 27px;">跳过客户认证流程</view>
				<u-switch v-model="formInfo.checked"></u-switch>
			</view>
		</view>
		<view class="btnBox">
			<button type="primary" @click="sendOrder">确认发送</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				formInfo: {
					name: '',
					phone: '',
					orderNum: '',
					checked: false
				},
				imageStyles: {
					width: 100,
					height: 100,
					margin: '10px',
					border: {
						radius: '5px'
					}
				},
				listStyles: {
					// 是否显示边框
					border: true,
					// 是否显示分隔线
					dividline: true,
					// 线条样式
					borderStyle: {
						width: 1,
						color: 'blue',
						style: 'dashed',
						radius: 2
					}
				},
				fileLists: [{
					url: '../../static/orderImg.png',
					extname: 'png',
					name: 'shuijiao.png'
				}]
			}
		},
		onLoad() {

		},
		methods: {
			sendOrder() {
				let that = this;
				wx.showModal({
					title: '提示',
					content: '确认发送订货单？',
					success(res) {
						if (res.confirm) {
							console.log('用户点击确定', that.fileLists, that.formInfo)
							uni.showLoading({
								title: "发送中...",
								mask: true
							})
							setTimeout(() => {
								uni.hideLoading();
								uni.showToast({
									title: "发送成功",
									icon: "success",
									duration: 1000
								})
							}, 1000)
							setTimeout(() => {
								uni.redirectTo({
									url: "/pages/historyOrderList/historyOrderList"
								})
							}, 1500)
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			}
		},
	}
</script>

<style scoped lang="less">
	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		box-sizing: border-box;
		background-color: #f5f7fb;

		.formBox {
			flex: 1;
			margin: 20px 10px 10px;
			background-color: #FFFFFF;
			overflow-x: hidden;
			overflow-y: auto;
			border-radius: 5px;
			box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);
			z-index: 2;

			.form-item {
				border-bottom: 1rpx solid #e7e7e7;
				padding: 10px;
				display: flex;
				font-size: 14px;

				.title {
					font-size: 14px;
					width: 80px;
					color: #333;
				}

				.input {
					font-size: 14px;
					flex: 1;
				}
			}

			.header {
				background-color: #55e2d0;
				color: #fff;
			}
		}

		.btnBox {
			// height: 70px;
			background-color: #fff;

			button {
				background: #3fa89a;
			}
		}
	}

	.bgView {
		position: absolute;
		z-index: 0;
		top: 0;
		left: 0;
		height: 100px;
		width: 100%;
		background-image: linear-gradient(#3fa89a, #fff);
	}
</style>
