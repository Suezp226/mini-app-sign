<template>
	<view class="content">
		<!-- <UserHeader></UserHeader> -->
		<view class="bgBox" ></view>
		<view class="buttonBox">
			<ul>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					发送订单（销售内务）
					<view class="btn">去发送</view>
				</li>
				<li>
					<image src="../../static/home2.png" mode="aspectFit"></image>
					发送发货单（销售内务）
				</li>
				<!-- <li>
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
				</li> -->
			</ul>
		</view>
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
				title: 'Hello'
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
				uni.request({
					url: 'https://aip.baidubce.com/oauth/2.0/token',
					method: 'GET',
					header: {
						'content-type': 'application/json'
					},
					data: {
						grant_type: 'client_credentials',
						client_id: '5vZrXRzZh99FGDZDF6lGkHce',
						client_secret: 'GCdORqyohGfS9jzyq6X4lnRXs8mo6RNd'
					},
					success(res) {
						console.log('请求返回参数', res.data)
						console.log('access_token'.res.data.access_token)
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	@green: rgb(63, 131, 128);
	.bgBox {
		height: 100px;
		width: 100%;
		position: absolute;
		z-index: 0;
		background-image: linear-gradient(#3fa89a, #fff);
		// background-color: #3fa89a;
	}
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
			margin-top: 5px;

			ul {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				padding-top: 10px;

				li {
					position: relative;
					display: flex;
					align-items: cneter;
					padding: 40px 10px;
					letter-spacing: 1px;
					font-size: 16px;
					background-color: #fff;
					color: #333;
					line-height: 30px;
					width: 100%;
					margin: 10px;
					border-radius: 5px;
					box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);

					image {
						height: 30px;
						width: 30px;
						margin: 0 20px 0 20px;
						border-radius: 5px;
					}
				}
			}
		}
	}
</style>
