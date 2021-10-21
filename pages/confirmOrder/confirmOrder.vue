<template>
	<view class="content">
		<!-- 只有客户能看到的 确认订单 -->
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
							{{item.orderCode}}
						</view>
						<u-tag type="info" v-if="item.orderStat == '0'" text="待确认" mode="dark" :closeable="false" />
						<u-tag type="success" v-if="item.orderStat == '1'" text="已确认" mode="dark" :closeable="false" />
						<u-tag type="info" v-if="item.orderStat == '9'" text="已销毁" mode="dark" :closeable="false" />
					</view>
					<view slot="body" class="body">
						<view class="form-item">
							<view class="title">客户:</view>
							<view class="input">{{item.custName}}</view>
						</view>
						<view class="form-item" >
							<view class="title">手机号:</view>
							<view class="input">{{item.custPhone}}</view>
						</view>
						<view class="form-item">
							<view class="title">时间:</view>
							<view class="input">{{new Date(item.makerTime).toLocaleString()}}</view>
						</view>
						<view class="form-item">
							<view class="title">货单:</view>
							<view class="input">
								<u-image @click="previewImg(item.orderImage)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,index) in getFileList(item.orderImage).list" ></u-image>
								<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,index) in getFileList(item.orderImage).file" ></u-image>
								<button type="primary" v-if="item.orderStat == '0'" @click="openConformModal(item)">去确认</button>
							</view>
						</view>
					</view>
				</u-card>
				<u-empty text="暂无相关内容" mode="list" v-if="tableList.length == 0"></u-empty>
				<view class="loadingWarp" v-if="showLoading">
					<u-loading size="70" color="#3498db"></u-loading>
				</view>
			</scroll-view>
			<u-modal v-model="showModal" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
				<view class="tipsContent" >
					请仔细货单查看内容,<br>
					点击 <view class="boldFont">确认</view> 进入人脸识别确认订单.
				</view>
			</u-modal>
		</view>
		<view class="loadCover" v-if="pageLoading">
			<u-loading mode="circle" color="#3498db" size="60"></u-loading>
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
					orderStat: "0",
					offset: 0,
					limit: 10,
				},
				total: 0,
				showLoading: false,
				tableList: [],
				showModal: false,
				nowItem: {},
				pageLoading: false
			}
		},
		watch: {},
		onLoad(options) {
			if(options.id) { // 人脸成功更改订单状态
				this.pageLoading = true
				this.confirmSuccess(options);
			}
			this.searchForm.custName = this.$store.state.userInfo.userName;
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
			getFileList(arr) {
				let list = [];
				let file = [];
				if(arr.length != 0) {
					arr.forEach(ele=>{
						if(this.$judgeFiletype.isImageFn(ele)) {
							list.push(this.$imgBaseUrl + ele)
						} else {
							file.push(this.$imgBaseUrl + ele);
						}
					})
				}
				return {
					list,
					file
				}
			},
			goFile(item) {
				window.open(item);
			},
			previewImg(item) {
				let urls = this.getFileList(item).list
				console.log(urls)
				uni.previewImage({
				    urls: urls
				});
			},
			getData() {
				console.log(this.current);
				this.showLoading = true;
				this.tableList = [];
				this.$request('/mallOrder/query', 'POST', this.searchForm).then(res => {
					this.tableList = res.data.list;
					res.data.list.forEach((ele,i)=>{
						this.tableList[i].orderImage = JSON.parse(ele.orderImage);
					})
					this.total = res.data.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				this.$request('/mallOrder/query', 'POST', this.searchForm).then(res => {
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
			openConformModal(item) {
				console.log(item);
				this.nowItem = item;
				this.showModal = true;
			},
			goConfirm() {
				let nowUrl = window.location.href;
				this.$request('/face/getAuth','POST',{}).then(res=>{
					console.log(res.data.access_token,JSON.parse(res.data.verify_token).result.verify_token,'回参')
					let accToken = res.data.access_token;
					let token = JSON.parse(res.data.verify_token).result.verify_token;
					let local = window.location.host;
					let successUrl = encodeURIComponent(`http://${local}/#/pages/confirmOrder/confirmOrder?id=${this.nowItem.moId}&name=${this.$store.state.userInfo.roleName}&atoken=${accToken}&vtoken=${token}`);
					let faillUrl = encodeURIComponent(`http://${local}/#/pages/confirmOrder/confirmOrder`);
					console.log(faillUrl)
					// return
					window.location.href = `https://brain.baidu.com/face/print/?token=${token}&
					successUrl=${successUrl}&
					failedUrl=${faillUrl}`
				})
			},
			confirmSuccess(options) {
				let param = {
					moId: options.id,
					orderStat: '1'
				}
				
				// 确认
				this.$request('/baidu/rpc/2.0/brain/solution/faceprint/result/detail?access_token='+options.atoken,'POST',{"verify_token": options.vtoken})
				.then(res=>{
					console.log(res,'获取结果')
					if(res.success && res.result.idcard_confirm.name == options.name) {
						// 验证成功
						this.pageLoading = false;
						uni.showToast({
							icon: 'success',
							title: '人脸核验成功',
						})
						setTimeout(()=>{
							this.$request('/mallOrder/updateStat','POST',param).then(res=>{
								console.log(res,'回参')
								if(res.code == 200) {
									uni.showToast({
										icon: 'success',
										title: '订单确认成功！',
									})
									setTimeout(()=>{
										uni.navigateTo({
											url: '/pages/historyOrderList/historyOrderList?type=0'
										})
									},1500)
								} else {
									uni.showToast({
										icon: 'success',
										title: '服务器异常'
									})
								}
							})
						},1000)
					} else {
						this.pageLoading = false;
						uni.showToast({
							icon: 'error',
							title: '身份信息与订单不符',
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
						right: -13px;
						bottom: -35px;
						font-size: 14px;
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
</style>
