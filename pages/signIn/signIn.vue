<template>
	<view class="content">
		<u-search :clearabled="true" input-align="left" v-model="searchForm.orderCode" placeholder="请输入订单号"
			@search="getData" @custom="getData" @clear="getData"></u-search>
		<view style="flex: 1;overflow: hidden;" >
			<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-triggered="refreshTrigger"
				:refresher-threshold="65" refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh"
				@scrolltolower="onreachBottom">
				<u-card margin="10px 5px 15px 5px" class="ucard" v-for="item in tableList" :key="item.moId">
					<view slot="head" class="head">
						<view class="headTips">
							<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
							{{item.invoiceCode}}
						</view>
						<u-tag type="info" v-if="item.invoiceStat == '2'" text="待签收" mode="dark" :closeable="false" />
						<u-tag type="success" v-if="item.invoiceStat == '3'" text="已签收" mode="dark" :closeable="false" />
						<u-tag type="info" v-if="item.invoiceStat == '9'" text="已销毁" mode="dark" :closeable="false" />
					</view>
					<view slot="body" class="body">
						<view class="form-item">
							<view class="title">客户:</view>
							<view class="input">{{item.custName}}</view>
						</view>
						<view class="form-item">
							<view class="title">时间:</view>
							<view class="input">{{new Date(item.makerTime).toLocaleString()}}</view>
						</view>
						<view class="form-item">
							<view class="title">货单:</view>
							<view class="input">
								<uni-file-picker style="margin-top:5px;" limit="1" readonly :value="fileLists"
									:imageStyles="{height: '70px',width: '70px'}" file-mediatype="image"></uni-file-picker>
								<button class="changePeople" @click="openChangeModal(item)" type="primary">变更收货人</button>
								<button type="primary" @click="openSignModal(item)">签收</button>
							</view>
						</view>
					</view>
				</u-card>
				<view class="loadingWarp" v-if="showLoading">
					<u-loading size="70" color="#3498db"></u-loading>
				</view>
			</scroll-view>
			<u-modal v-model="confirmDialog" title="确认签收" :show-cancel-button="true" @confirm="goConfirm()">
				<view class="modelContent">
					<u-radio-group v-model="haveMsg" :wrap="true" size="20px">
						<u-radio name="0" style="margin-bottom: 20px;"> 无异议</u-radio>
						<u-radio name="1" style="margin-bottom: 20px;"> 有异议</u-radio>
						<u-input v-if="haveMsg==1" v-model="confirmMsg" style="width: 220px;" type="textarea" :border="true"
							height="100" :auto-height="true" />
					</u-radio-group>
				</view>
			</u-modal>
			<u-modal v-model="changeDialog" title="变更收货人" :show-cancel-button="true" @confirm="goConfirm()">
				<view class="modelContent">
					<view class="form-item modal-item">
						<view class="title">姓名</view>
						<input class="input" name="input" v-model="reciver.name" placeholder="请输入..." />
					</view>
					<view class="form-item modal-item">
						<view class="title">手机号</view>
						<input class="input" name="input" v-model="reciver.phone" placeholder="请输入..." />
					</view>
				</view>
			</u-modal>
			<u-modal v-model="showModal" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
				<view class="tipsContent" >
					请仔细货单查看内容,<br>
					点击 <view class="boldFont">确认</view> 进入人脸识别确认订单.
				</view>
			</u-modal>
		</view>
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
				searchForm: {
					orderCode: "",
					custName: "",
					busiManName: "", //业务员
					makerName: "", //销售内勤
					invoiceStat: "2",
					offset: 0,
					limit: 10,
				},
				total: 0,
				showLoading: false,
				tableList: [],
				showModal: false,
				confirmDialog: false,
				haveMsg: 0,
				confirmMsg: '',
				confirmDialog: false, // 确认签收弹窗显示
				changeDialog: false, // 变更收货人
				reciver: {
					name: '',
					phone: ''
				},
				nowItem: {}
			}
		},
		watch: {},
		onLoad() {
			if(options.param) {
				console.log(JSON.parse(options.param));
				this.confirmSuccess(JSON.parse(options.param));
			}
			this.getData();
		},
		methods: {
			// scroll-view到底部加载更多
			onreachBottom() {
				if (this.searchForm.limit >= this.total) {
					uni.showToast({
						icon: 'none',
						title: '已经没有更多了~'
					})
					return
				}
				this.searchForm.limit += 10;
				this.getMoreData();
			},
			// scroll-view 下拉刷新
			refresherrefresh() {
				this.refreshTrigger = true;
				this.getData();
			},
			getData() {
				console.log(this.current);
				this.showLoading = true;
				this.tableList = [];
				this.$request('/mallInvoice/query', 'POST', this.searchForm).then(res => {
					this.tableList = res.data.list
					this.total = res.data.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				this.$request('/mallInvoice/query', 'POST', this.searchForm).then(res => {
					this.tableList = res.data.list
					this.total = res.data.total;
				})
			},
			copy(info) {
				uni.setClipboardData({
					data: info,
					success: function() {
						console.log('复制成功');
					}
				});
			},
			// 变更收货人
			openChangeModal(item) {
				this.changeDialog = true;
				this.nowItem = item;
			},
			// 确认签收
			openSignModal(item) {
				this.nowItem = item;
				this.confirmDialog = true;
			},
			openConformModal() {
				this.showModal = true;
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
			},
			goConfirm() {
				let nowUrl = window.location.href;
				let param = {...this.nowItem};
				this.$request('/get/faceAuth','POST',{}).then(res=>{
					console.log(res,'回参')
					let token = res.data;
					let local = window.location.host;
					let stringParam = JSON.stringify(this.nowItem);
					window.location.href = `https://brain.baidu.com/face/print/?token=${token}&
					successUrl=${local}/#/pages/confirmOrder/confirmOrder?param=${stringParam}&
					failedUrl=${nowUrl}`
				})
			},
			confirmSuccess(options) {
				let param = {...options};
				param.invoiceStat = '3';
				this.$request('/mallInvoice/save','POST', param).then(res=>{
					console.log(res,'回参')
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '启运成功！'
						})
						// setTimeout(()=>{
						// 	uni.navigateTo({
						// 		url: '/pages/historyOrderList/historyOrderList'
						// 	})
						// },500)
					} else {
						uni.showToast({
							icon: 'success',
							title: res.msg
						})
					}
				})
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

		.utabs {
			border-bottom: 1px solid #e7e7e7;
		}

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
					width: 50px;
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

		.ucard:nth-last-child(1) {
			margin-bottom: 30px;
		}
	}

	.swiper {
		flex: 1;
		flex-direction: column;
	}

	.scrollView {
		height: 100%;
		width: 100%;
		padding: 0 10px;
		box-sizing: border-box;
	}
	.modelContent {
		padding: 20px;
	}
	
	.modal-item {
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

	/deep/ .u-search {
		flex: none;
		padding: 10px 20px;
		background-color: #fff;
	}

	.loadingWarp {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 50;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.1);
		transition: all 0.5s ease-in-out;
	}
	/deep/ .u-radio__label {
		padding-left: 10px;
	}
</style>