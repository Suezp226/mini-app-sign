<template>
	<view class="content">
		<image class="logo" src="/static/logo.png"></image>
		<text>{{title}}</text>
		<button type="primary" @click="goNextPage">跳转第二页</button>
		
		<button type="default" @click="getInfo" style="margin-top:20px;">获取信息</button>
	</view>
</template>

<script>
	export default {
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
				    url: '/pages/index/second?id=1&name=uniapp'
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
					url:'https://aip.baidubce.com/oauth/2.0/token',
					method: 'GET',
					header: {
						'content-type':'application/json'
					},
					data: {
						grant_type: 'client_credentials',
						client_id: '5vZrXRzZh99FGDZDF6lGkHce',
						client_secret: 'GCdORqyohGfS9jzyq6X4lnRXs8mo6RNd'
					},
					success(res) {
						console.log('请求返回参数',res.data)
						console.log('access_token'.res.data.access_token)
					}
				})
			},
		}
	}
</script>

<style scoped lang="less">
	.content {
		// height: 900px;
	}

	.logo {
		display: block;
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}
</style>
