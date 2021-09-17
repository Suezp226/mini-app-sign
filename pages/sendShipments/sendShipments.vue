<template>
	<view class="content">
		<view class="bgView"></view>
		<view class="formBox" >
			<!-- <view class="form-item header" >
			    <view style="width:100%;text-align:center;"></view>
			 </view> -->
			<view class="form-item">
			    <view  class="title">客户姓名</view>
			    <input class="input" name="input" v-model="formInfo.name" placeholder="请输入..." />
			 </view>
			<view class="form-item">
			    <view  class="title">手机号</view>
			    <input class="input" name="input" v-model="formInfo.phone" placeholder="请输入..." />
			 </view>
			<view class="form-item">
			    <view  class="title">订单号</view>
			    <input class="input" name="input" v-model="formInfo.orderNum" placeholder="请输入..." />
			 </view>
			 <view class="form-item">
				 <uni-group title="只选择图片">
				 	<uni-file-picker limit="3" title="请上传发货单图片" :value="fileLists" :imageStyles="imageStyles" file-mediatype="image"></uni-file-picker>
				 </uni-group>
			 </view>
		</view>
		<view class="btnBox" >
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
					orderNum: ''
				},
				imageStyles:{
					width: 100,
					height: 100,
					margin: '10px',
					border: {
						radius: '5px'
					}
				},
				listStyles:{
					// 是否显示边框
					border: true,
					// 是否显示分隔线
					dividline: true,
					// 线条样式
					borderStyle: {
						width:1,
						color:'blue',
						style:'dashed',
						radius:2
					}
				},
				fileLists:[{
					url:'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/b7c7f970-517d-11eb-97b7-0dc4655d6e68.jpg',
					extname:'png',
					name:'shuijiao.png'
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
				  success (res) {
				    if (res.confirm) {
				      console.log('用户点击确定',that.fileLists,that.formInfo)
					  uni.navigateBack({
					      delta: 1
					  });
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
				border-bottom: 1rpx solid #b1b1b1;
				padding: 10px;
				display: flex;
				font-size: 14px;
				.title {
					width: 80px;
					color: #333;
				}
				.input {
					flex: 1;
				}
			}
			.header {
				background-color: #55e2d0;
				color: #fff;
			}
		}
		.btnBox {
			height: 70px;
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
