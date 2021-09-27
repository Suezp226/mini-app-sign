<template>
	<view class="content">
		<view class="bgView">
			<view class="userLogo">
				<image src="../../static/image/check.png" mode="aspectFit"></image>
			</view>
			<image class="fixBottom" src="../../static/image/curveNegative.svg" mode="aspectFit"></image>
		</view>

		<view class="formBox">
			<!-- <view class="form-item">
				<view class="title">
					<image src="../../static/image/name.png" mode="aspectFit"></image>
				</view>
				<input class="input" name="input" placeholder="请输入姓名" />
			</view>
			<view class="form-item">
				<view class="title">
					<image src="../../static/image/idcard.png" mode="aspectFit"></image>
				</view>
				<input class="input" name="input" placeholder="请输入身份证" />
			</view> -->
		</view>
		<view class="btnBox">
			<button type="primary" @click="next">下一步</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				files: [],
			}
		},
		onLoad() {

		},
		methods: {
			next() {
				console.log('下一步身份认证');
				let gourl = encodeURIComponent("https://ai.baidu.com");
				// uni.request({
				// 	url: 'https://brain.baidu.com/solution/faceprint/idcard/submit',
				// 	method: 'GET',
				// 	header: {
				// 		'content-type': 'application/json'
				// 	},
				// 	data: {
				// 		"verify_token": 'grGwjnptevHWTJ7ps7i2iTfZ',
				// 		"id_name": "苏智鹏",
				// 		"id_no": "35032219970226711X",
				// 		"certificate_type": 0  
				// 	},
				// 	success(res) {
				// 		console.log('请求返回参数', res.data)
				// 		console.log('access_token'.res.data.access_token)
				// 	}
				// })
				window.location.href = 'https://brain.baidu.com/face/print/?token=' + 'myYSvFgFJLmlOyz5if2xUYj2' +'&successUrl='+ gourl +'&failedUrl=' + gourl;
				// 'https://brain.baidu.com/face/print/?token=' + 'grGwjnptevHWTJ7ps7i2iTfZ' +'&successUrl='+ gourl +'&failedUrl=' + gourl
			},
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

		.bgView {
			position: relative;
			height: 140px;
			width: 100%;
			text-align: center;
			line-height: 80px;
			color: #fff;

			background: rgb(77, 193, 177);
			background: linear-gradient(0deg, rgba(77, 193, 177, 1) 0%, rgba(63, 168, 154, 1) 35%);

			.userLogo {
				height: 60px;
				text-align: center;
				margin-top: 20px;

				image {
					height: 65px;
					width: 65px;
					background-color: #fff;
					border-radius: 2px;
				}
			}

			.desc {
				letter-spacing: 2px;
				height: 50px;
				line-height: 50px;
			}

			.fixBottom {
				position: absolute;
				bottom: 0;
				left: 0;
				height: 40px;
				width: 100%;
			}
		}

		.formBox {
			padding: 10px;
			background-color: #FFFFFF;
			overflow-x: hidden;
			overflow-y: auto;
			z-index: 2;
			padding: 15px 40px 39px 40px;

			.form-item {
				position: relative;
				border-bottom: 1rpx solid #e3e3e3;
				padding: 10px;
				display: flex;
				align-items: center;
				font-size: 14px;
				margin: 15px 0;

				.title {
					width: 40px;
					color: #333;

					image {
						height: 25px;
						width: 25px;
					}
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

		@media screen and (max-width: 350px) {
			.formBox {
				padding: 15px 20px 39px 20px;
			}
		}

		.btnBox {
			flex: 1;
			background-color: #fff;

			button {
				background: #3fa89a;
				width: 78%;
				border-radius: 30px;
			}
		}
	}
</style>
