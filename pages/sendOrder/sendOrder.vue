<template>
	<view class="content">
		<view class="bgView"></view>
		<view class="formBox" >
			<!-- <view class="form-item header" >
			    <view style="width:100%;text-align:center;"></view>
			 </view> -->
			<view class="form-item">
			    <view  class="title">客户姓名</view>
			    <input class="input" name="input" placeholder="请输入..." />
			 </view>
			<view class="form-item">
			    <view  class="title">手机号</view>
			    <input class="input" name="input" placeholder="请输入..." />
			 </view>
			<view class="form-item">
			    <view  class="title">订单号</view>
			    <input class="input" name="input" placeholder="请输入..." />
			 </view>
			 <view class="form-item">
				 <uni-group title="只选择图片">
				 	<uni-file-picker limit="3" title="请上传订货单图片" :value="fileLists" :imageStyles="imageStyles" file-mediatype="image"></uni-file-picker>
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
				files: [],
				value4:"",
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
			chooseImage(e) {
				let that = this;
				wx.chooseImage({
					sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
					success: function(res) {
						// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
						that.files = that.files.concat(res.tempFilePaths);
						console.log(that.files, '选择图片')
					}
				})
			},
			sendOrder() {
				wx.showModal({
				  title: '提示',
				  content: '确认发送订货单？',
				  success (res) {
				    if (res.confirm) {
				      console.log('用户点击确定')
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
