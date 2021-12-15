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
				<input class="input" name="input" maxlength="6" v-model="input.code" placeholder="请输入验证码" />
				<view class="getNumBtn" @click="getPhoneCheckNum">
					<button type="primary" v-if="timer == null">获取验证码</button>
					<button type="primary" v-else class="counting">{{count}}秒后可重新获取</button>
				</view>
			</view>
		</view>
		<view class="btnBox">
			<button type="primary" @click="login">登入</button>
		</view>
		
		<u-modal v-model="showModal" title="温馨提示" :show-cancel-button="true" @confirm="agree" >
			<view class="modalContent" >
				<text class="blueColor" @click="showPrivateContent=true" >隐私协议</text>
			</view>
		</u-modal>
		
		<u-popup v-model="showPrivateContent" mode="bottom" border-radius="14" closeable >
			<view class="privateContent" >隐私协议内容</view>
		</u-popup>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				count: 0,
				agreePrivacyPolicy: false, //是否统一隐私协议
				showModal: false,  // 隐私协议提示框
				showPrivateContent: false , // 隐私协议提示内容 弹层
				input: {
					phone: '',
					code: ''
				}
			}
		},
		onLoad(options) {
			console.log(options.type)
			if(options.type == 'logout') {
				this.$store.commit('putUserInfo', JSON.stringify({userName: '点击登录',userPhone: '',roleName: '暂无'}));
				uni.removeStorageSync('userInfo');
				uni.removeStorageSync('token');
			}
		},
		onUnload() {
			if(this.timer) {
				clearInterval(this.timer);
			}
		},
		methods: {
			isMobile (mobile) {
			  return /^1\d{10}$/.test(mobile)
			},
			judgeInfo() {
				// 身份信息验证
				uni.request({
					url: 'https://aip.baidubce.com/rest/2.0/face/v3/person/idmatch?access_token=24.a527eb57a17d291d97e752b1d06f89c1.2592000.1641892949.282335-25332674',
					method: 'POST',
					header: {},
					data: {
						"id_card_number": '35032219970226711X', 
						"name": "苏智鹏"
					},
					dataType: 'json',
					timeout: 300000,
				}).then(res=>{
					console.log(res,'校验回参')
				})
			},
			fakeLogin() {
				let json = {"muId":2,"userCode":"admin","userName":"admin","userPwd":"c30807e6587ade285ba7ade9f881b3d7","roleCode":"admin","roleName":"admin","workDate":"2021-09-20T16:00:00.000+00:00","userPhone":"13812345678","userCarnum":null,"offset":0,"limit":0};
				uni.setStorageSync('token', '5d68d25e-a7a3-42ae-8d31-49c31ef9d26c')
				uni.setStorageSync('userInfo',JSON.stringify(json));
				this.$store.commit('putUserInfo',JSON.parse(uni.getStorageSync('userInfo')));
				this.$store.commit('changePosition', json.roleCode);
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
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
					msgCode: this.input.code,
					phone: this.input.phone + ''
				}
				
				this.$request('/user/mobileLogin','POST',param).then(res=>{
					console.log(res);
					if(res.code == 200) {
						uni.setStorageSync('token', res.data.token)
						uni.setStorageSync('userInfo',JSON.stringify(res.data.user));
						this.$store.commit('putUserInfo',JSON.parse(uni.getStorageSync('userInfo')));
						this.$store.commit('changePosition', res.data.user.userType);
						console.log(this.$store.userInfo,this.$store.userPosition,'在这俩 ')
						uni.reLaunch({
							url:'/pages/index/index'
						})
						console.log('执行登入');
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 2000
						})
					}
					if(this.timer) {
						clearInterval(this.timer);
					}
				})
					
			},
			getPhoneCheckNum() {
				
				if(!this.isMobile(this.input.phone)) {
					uni.showToast({
						title: '请输入正确手机号',
						icon: 'none',
						duration: 1500
					})
					return
				}
				
				if (this.timer == null) {
					setTimeout(() => {
						clearInterval(this.timer);
						this.timer = null;
					}, 60000)
					this.count = 60;
					this.timer = setInterval(() => {
						this.count--;
					}, 1000)
				}
				
				this.$request('/getCode','GET',{phone:this.input.phone}).then(res=>{
					// 过审 自动获得码
					if(this.input.phone == '13812345678' ) {
						this.input.code = res.checkCode;
					}
					
					console.log(res)
					if(res.code == 200) {
						uni.showToast({
							title: res.msg,
							icon: 'success',
							duration: 1500
						})
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none',
							duration: 1500
						})
					}
				})
				
			},
			agree() {
				this.agreePrivacyPolicy = true;  // 同意隐私协议
				this.showModal = false; //关闭隐私协议模态框
				this.login();
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
	.modalContent {
		padding: 20rpx;
		.blueColor {
			color: blue;
		}
	}
	.privateContent {
		padding: 60rpx 20rpx 20rpx;
		min-height: 700rpx;
	}
</style>
