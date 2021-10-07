<template>
	<view class="content">
		<view class="bgView">
			<view class="userLogo">
				<image src="../../static/image/user.png" mode="aspectFit"></image>
			</view>
			<view class="desc">请登入</view>
			<image class="fixBottom" src="../../static/image/curveNegative.svg" mode="aspectFit"></image>
		</view>

		<view class="formBox">
			<view class="form-item">
				<view class="title">
					<image src="../../static/image/phone.png" mode="aspectFit"></image>
				</view>
				<input class="input" name="input" v-model="input.phone" placeholder="请输入手机号" />
			</view>
			<view class="form-item">
				<view class="title">
					<image src="../../static/image/lock.png" mode="aspectFit"></image>
				</view>
				<input class="input" name="input" v-model="input.code" placeholder="请输入验证码" />
				<view class="getNumBtn" @click="getPhoneCheckNum">
					<button type="primary" v-if="timer == null">获取验证码</button>
					<button type="primary" v-else class="counting">{{count}}秒后可重新获取</button>
				</view>
			</view>
		</view>
		<view class="btnBox">
			<button type="primary" @click="login">登入</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				count: 0,
				nowUuid: '',
				input: {
					phone: '',
					code: ''
				}
			}
		},
		onLoad(options) {
			console.log(options.type)
		},
		onUnload() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},
		methods: {
			login() {
				if(!this.input.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 1500
					})
					return
				}
				
				if(!this.input.code) {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none',
						duration: 1500
					})
					return
				}
				
				let param = {
					uuid: this.nowUuid,
					msgCode: this.input.code,
					phone: this.input.phone + ''
				}
				this.$request('/user/login','POST',param).then(res=>{
					console.log(res)
					uni.setStorageSync('token', '123321')
					uni.reLaunch({
						url:'/pages/index/index'
					})
					console.log('执行登入');
					if(this.timer) {
						clearInterval(this.timer);
					}
				})
					
			},
			getPhoneCheckNum() {
				this.nowUuid = new Date().valueOf() + '';
				if (this.timer == null) {
					let param = {
						uuid: this.nowUuid,
						receiverPhone: this.input.phone,
						receiver: 'suezp'
					}
					this.$request('/msg/getMsgCode','POST',param).then(res=>{
						console.log(res.data)
						this.input.code = res.data;
						if(res.code != 200) return
						uni.showToast({
							title: '发送成功',
							icon: 'success',
							duration: 2000
						})
						setTimeout(() => {
							clearInterval(this.timer);
							this.timer = null;
						}, 60000)
						this.count = 60;
						this.timer = setInterval(() => {
							this.count--;
						}, 1000)
					})
				}
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
					height: 60px;
					width: 60px;
					background-color: #fff;
					border-radius: 30px;
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

				.getNumBtn {
					position: absolute;
					z-index: 5;
					right: 0px;
					overflow: hidden;

					button {
						background-color: #fff;
						border: 1px solid #2e62cd;
						color: #2e62cd;
						border-radius: 15px;
						font-size: 14px;
						line-height: 20px;
						padding: 5px 10px;
						margin: 0;
					}

					.counting {
						width: 125px;
						border: 1px solid #646464;
						font-size: 12px;
						color: #646464;
					}
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
