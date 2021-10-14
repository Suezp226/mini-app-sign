<template>
	<view class="outBox" @click="goLogin">
		<view class="infoBox">
			<view class="leftBox">
				<u-image src="/static/image/user.png" mode="widthFix"></u-image>
			</view>
			<view class="rightBox">
				<view class="name">{{userInfo.userName}}</view>
				<view class="phone">{{userInfo.userPhone}}</view>
				<view class="tag" v-if="userInfo.roleCode != 'kh'" >{{userInfo.roleName?userInfo.roleName:translateRoleName}}</view>
				<view class="tag" v-else >{{translateRoleName}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		computed: {
			userPosition: {
				get: function() {
					return this.$store.state.userPosition
				},

				set: function(e) {
					console.log(e)
				}
			},
			userInfo: {
				get: function() {
					return this.$store.state.userInfo
				},
				
				set: function(e) {
					console.log(e)
				}
			}
		},
		data() {
			return {
				isWxOpen: false,
				translateRoleName: '',
				list: [
						{
							name: '管理员',
							value: 'admin',
							disabled: false
						},
						{
							name: '业务员',
							value: 'ywy',
							disabled: false
						},
						{
							name: '销售内勤',
							value: 'xsnq',
							disabled: false
						},
						{
							name: '客户',
							value: 'kh',
							disabled: false
						},
						{
							name: '司机',
							value: 'sj',
							disabled: false
						},
						{
							name: '收货人',
							value: 'shr',
							disabled: false
						},
					]
			}
		},
		onLoad() {},
		mounted() {
			this.changeRoleName()
		},
		methods: {
			goNextPage() {
				console.log('执行跳转')
				// uni.getSystemInfo({
				//     success: function (res) {
				//         console.log(res.model);
				//         console.log(res.pixelRatio);
				//         console.log(res.windowWidth);
				//         console.log(res.windowHeight);
				//         console.log(res.language);
				//         console.log(res.version);
				//         console.log(res.platform);
				//     }
				// });
				// 判断微信内部打开
				if (window.navigator.userAgent.toLocaleLowerCase().match(/microMessenger/i)) {
					this.isWxOpen = true;
					console.log('微信内部打开')
				} else {
					console.log('非微信内部打开')
				}
				// uni.navigateTo({
				// 	url: '/pages/index/center?id=1&name=uniapp'
				// });
			},
			changeRoleName(){
				console.log(this.$store.state.userInfo.roleCode,'在这')
				this.list.forEach(ele=>{
					if(ele.value == this.$store.state.userInfo.roleCode) {
						this.translateRoleName = ele.name
					}
				})
			},
			goLogin() {
				if( this.userInfo.userName !== '点击登录'){
					return
				}
				uni.navigateTo({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style scoped lang="less">
	.outBox {
		padding-top: 20px;
		background-image: linear-gradient(#3fa89a, #fff);
	}

	.infoBox {
		// background-image: url(../../static/image/bg1.png);
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
				height: 40px;
				width: 40px;
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
