<template>
	<view class="content">
		<UserHeader></UserHeader>
		<view class="buttonBox">
			<ul>
				<li @click="goNextPage('/pages/sendOrder/sendOrder')">
					<view class="liBox imgBox bgcolor1">
						<image src="../../static/order.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">发送订单</view>
				</li>
				<li @click="goNextPage('/pages/sendShipments/sendShipments')">
					<view class="liBox imgBox bgcolor2">
						<image src="../../static/sendOrder.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">发送发货单</view>
				</li>
				<li @click="goNextPage('/pages/sendShipments/sendShipments')">
					<view class="liBox imgBox bgcolor3">
						<image src="../../static/confirm.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">确认订单</view>
				</li>
				<li @click="goNextPage('/pages/sendShipments/sendShipments')">
					<view class="liBox imgBox bgcolor4">
						<image src="../../static/car.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">确认启运</view>
				</li>
				<li @click="goNextPage('/pages/sendShipments/sendShipments')">
					<view class="liBox imgBox bgcolor5">
						<image src="../../static/orderDone.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">货物签收</view>
				</li>
				<!-- <li>3</li>
				<li>4</li>
				<li>5</li>
				<li>6</li> -->
			</ul>
		</view>
		<!-- <view class="buttonBox">
			<ul>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					发送订单
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					发送发货单
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					确认订单（客户）
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					确认启运（司机）
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					查询运输情况（通用）
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					货物签收（收货人/变更人）
				</li>
			</ul>
		</view> -->
		<!-- <button type="default" @click="goNextPage">跳转第二页</button> -->
		<!-- <button type="default" @click="getInfo" style="margin-top:20px;">获取信息</button> -->
	</view>
</template>

<script>
	import UserHeader from '../components/userHeader.vue'
	export default {
		components: {
			UserHeader
		},
		data() {
			return {
				title: 'Hello',
				files: []
			}
		},
		onLoad() {

		},
		methods: {
			goNextPage(url) {
				console.log('执行跳转')
				uni.getSystemInfo({
				    success: function (res) {
				        console.log(res.model);
				        console.log(res.pixelRatio);
				        console.log(res.windowWidth);
				        console.log(res.windowHeight);
				        console.log(res.language);
				        console.log(res.version);
				        console.log(res.platform);
				    }
				});
				uni.navigateTo({
					url: url
				});
			},
			getInfo() {
				// uni.request({
				// 	url:'https://test.suezp.cn/api',
				// 	method: 'GET',
				// 	header: {
				// 		'content-type':'application/json'
				// 	},
				// 	data: {},
				// 	success(res) {
				// 		console.log('请求返回参数',res.data)
				// 	}
				// })
				// uni.request({
				// 	url: 'https://aip.baidubce.com/oauth/2.0/token',
				// 	method: 'GET',
				// 	header: {
				// 		'content-type': 'application/json'
				// 	},
				// 	data: {
				// 		grant_type: 'client_credentials',
				// 		client_id: '5vZrXRzZh99FGDZDF6lGkHce',
				// 		client_secret: 'GCdORqyohGfS9jzyq6X4lnRXs8mo6RNd'
				// 	},
				// 	success(res) {
				// 		console.log('请求返回参数', res.data)
				// 		console.log('access_token'.res.data.access_token)
				// 	}
				// })
			},
		}
	}
</script>

<style scoped lang="less">
	@green: rgb(63, 131, 128);

	.content {
		z-index: 2;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: #f5f7fb;
		box-sizing: border-box;

		.buttonBox {
			flex: 1;
			overflow-x: hidden;
			overflow-y: auto;

			ul {
				display: flex;
				flex-wrap: wrap;
				justify-content: flex-start;
				padding: 10px 0 0 0 ;

				li {
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 28%;
					margin: 10px;
					padding: 5px;
					border-radius: 5px;

					.liBox {
						display: block;
						font-size: 15px;
						color: #2c3e50;
					}

					.imgBox {
						margin-bottom: 15px;
						background-color: #fff;
						padding: 10px;
						box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);
						height: 50px;
						width: 50px;
						border-radius: 25px;

						image {
							height: 51px;
							width: 40px;
						}
					}

					.bgcolor1 {
						background-color: #9acefe;
					}

					.bgcolor2 {
						background-color: #fe77b7;
					}

					.bgcolor3 {
						background-color: #f9c083;
					}

					.bgcolor3 {
						background-color: #93e5a2;
					}

					.bgcolor4 {
						background-color: #fcaeae;
					}
					.bgcolor5 {
						background-color: #88dfde;
					}
				}
			}
		}

		@media screen and (max-width: 360px) {
			.buttonBox ul li {
				width: 27%;
			}
		}
	}
</style>
