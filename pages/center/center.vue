<template>
	<view class="content">
		<UserHeader></UserHeader>
		<view class="buttonBox">
			<ul>
				<li>
					<view class="liBox">
						<image src="../../static/history.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">历史收货</view>
				</li>
				<li>
					<view class="liBox">
						<image src="../../static/pen.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">个人信息</view>
				</li>
				<li>
					<image src="../../static/change.png" mode="aspectFit"></image>
					<view class="liBox">切换身份</view>
				</li>
				<li style="opacity:0;" ></li>
				<!-- <li>5</li>
				<li>6</li> -->
			</ul>
		</view>
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
				msg: '没错就是我',
			}
		},
		onLoad(options) {
			console.log('接受传参', options)
		},
		methods: {
			sayHi() {
				console.log('sayHi!', this.msg)
			}
		},
	}
</script>

<style scoped lang="less">
	.content {
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
				justify-content: center;
				padding: 10px 0 0 0;

				li {
					background-color: #fff;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					align-items: center;
					min-width: 135px;
					width: 40%;
					margin: 10px;
					padding: 10px 5px;
					border-radius: 5px;
					box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);
					height: 116px;

					image {
						height: 62px;
						width: 40px;
					}

					.liBox {
						width: 100%;
						display: block;
					}
				}
			}
		}

		@media screen and (max-width: 350px) {
			.buttonBox ul li {
				width: 135px !important;
			}
		}
	}
</style>
