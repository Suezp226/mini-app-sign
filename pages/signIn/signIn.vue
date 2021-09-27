<template>
	<view class="content">
		<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-threshold="90"
			:refresher-triggered="refreshTrigger" refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh"
			@scrolltolower="onreachBottom">
			<u-card margin="10px 5px 20px 5px" class="ucard">
				<view slot="head" class="head">
					<view class="headTips">
						<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
						XH2021080114
					</view>
					<u-tag type="primary" text="运输中" mode="dark" style="background-color: rgb(127,101,164);"
						:closeable="false" />
					<!-- <u-tag type="primary" text="运输中" mode="dark" :closeable="false" />
					<u-tag type="success" text="已签收" mode="dark" :closeable="false" /> -->
				</view>
				<view slot="body" class="body">
					<view class="form-item">
						<view class="title">客户:</view>
						<view class="input">普定县向荣矿业有限公司</view>
					</view>
					<view class="form-item">
						<view class="title">时间:</view>
						<view class="input">2021-09-18 15:25</view>
					</view>
					<view class="form-item">
						<view class="title">发货单</view>
						<view class="input">
							<uni-file-picker style="margin-top:5px;" limit="1" readonly :value="fileLists"
								:imageStyles="{height: '70px',width: '70px'}" file-mediatype="image"></uni-file-picker>
							<button class="changePeople" @click="changeDialog=true" type="primary">变更收货人</button>
							<button type="primary" @click="confirmDialog = true">签收</button>
						</view>
					</view>
				</view>
			</u-card>
		</scroll-view>
		<u-modal v-model="confirmDialog" title="确认签收" :show-cancel-button="true" @confirm="confirmRecive">
			<view class="modelContent">
				<u-radio-group v-model="haveMsg" :wrap="true" size="20px">
					<u-radio name="0" style="margin-bottom: 20px;"> 无异议</u-radio>
					<u-radio name="1" style="margin-bottom: 20px;"> 有异议</u-radio>
					<u-input v-if="haveMsg==1" v-model="confirmMsg" style="width: 220px;" type="textarea" :border="true"
						height="100" :auto-height="true" />
				</u-radio-group>
			</view>
		</u-modal>
		<u-modal v-model="changeDialog" title="变更收货人" :show-cancel-button="true" @confirm="confirmChange">
			<view class="modelContent">
				<view class="form-item">
					<view class="title">姓名</view>
					<input class="input" name="input" v-model="reciver.name" placeholder="请输入..." />
				</view>
				<view class="form-item">
					<view class="title">手机号</view>
					<input class="input" name="input" v-model="reciver.phone" placeholder="请输入..." />
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshTrigger: false,
				fileLists: [{
					url: '../../static/image/orderImg.png',
					extname: 'png',
					name: 'shuijiao.png'
				}],
				confirmDialog: false,
				haveMsg: 0,
				confirmMsg: '',
				confirmDialog: false, // 确认签收弹窗显示
				changeDialog: false, // 变更收货人
				reciver: {
					name: '',
					phone: ''
				}
			}
		},
		onLoad() {

		},
		methods: {
			// scroll-view到底部加载更多
			onreachBottom() {
				console.log('到底了')
			},
			refresherrefresh() {
				console.log('下拉刷新')
				this.refreshTrigger = true;
				setTimeout(() => {
					this.refreshTrigger = false;
				}, 500)
			},
			radioChange(key) {
				console.log(this.haveMsg)
				console.log()
			},
			// 确认签收
			confirmRecive() {
				let param = {
					haveMsg: this.haveMsg,
					confirmMsg: this.confirmMsg
				}
				console.log('签收', param)
			},
			// 变更收货人
			confirmChange() {
				console.dir(this.reciver)
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #f5f7fb;

		.ucard {
			margin-bottom: 20px;
			background-color: #fff;
			box-shadow: 0 0px 2px 1px rgba(0, 0, 0, 0.16) !important;
			color: #000;

			.head {
				display: flex;

				.headTips {
					flex: 1;
					display: inline-block;
					font-size: 15px;
				}
			}

			.form-item {
				display: flex;
				font-size: 15px;
				margin-bottom: 2px;

				.title {
					font-size: 15px;
					width: 55px;
					color: #333;
				}

				.input {
					font-size: 15px;
					flex: 1;
					position: relative;

					image {
						height: 70px;
						width: 70px;
					}

					button {
						position: absolute;
						right: 0;
						bottom: 0;
						font-size: 14px;
					}

					.changePeople {
						right: 70px;
						background-color: #ffa502;
					}
				}
			}
		}
	}

	.modelContent {
		padding: 20px;
	}

	.scrollView {
		flex: 1;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
	}

	.form-item {
		border-bottom: 1rpx solid #e7e7e7;
		padding: 10px;
		display: flex;
		font-size: 14px;

		.title {
			font-size: 14px;
			width: 80px;
			color: #333;
		}

		.input {
			font-size: 14px;
			flex: 1;
		}
	}
</style>
