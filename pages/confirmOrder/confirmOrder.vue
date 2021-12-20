<template>
	<view class="content">
		<!-- 只有客户能看到的 确认订单 -->
		<u-search :clearabled="true" input-align="left" v-model="searchForm.orderNo" placeholder="请输入订单号"
			@search="getData" @custom="getData" @clear="getData"></u-search>
		<view style="flex: 1;overflow: hidden;" >
			<scroll-view scroll-y class="scrollView" :show-scrollbar="false" refresher-enabled :refresher-triggered="refreshTrigger"
				:refresher-threshold="65" refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh"
				@scrolltolower="onreachBottom">
				<u-card margin="10px 5px 15px 5px" class="ucard" v-for="item in tableList" :key="item.orderNo">
					<view slot="head" class="head">
						<view class="headTips">
							<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
							{{item.orderNo}}
						</view>
						<u-tag type="info" v-if="item.orderStat == '0'" text="待确认" mode="dark" :closeable="false" />
						<u-tag type="success" v-if="item.orderStat == '1'" text="已确认" mode="dark" :closeable="false" />
						<u-tag type="info" v-if="item.orderStat == '9'" text="已作废" mode="dark" :closeable="false" />
					</view>
					<view slot="body" class="body">
						<view class="form-item" >
							<view class="title">客户:</view>
							<view class="input">{{item.company}}</view>
						</view>
						<view class="form-item" >
							<view class="title">订货人:</view>
							<view class="input">{{item.bookName}}</view>
						</view>
						<view class="form-item" >
							<view class="title">手机号:</view>
							<view class="input phoneCall" @click="phoneCall(item.bookPhone)">{{item.bookPhone}}</view>
						</view>
						<view class="form-item" >
							<view class="title">业务员:</view>
							<view class="input">{{item.ywyName}}</view>
						</view>
						<view class="form-item" >
							<view class="title">手机号:</view>
							<view class="input phoneCall" @click="phoneCall(item.ywyPhone)">{{item.ywyPhone}}</view>
						</view>
						<view class="form-item" >
							<view class="title">内勤:</view>
							<view class="input">{{item.makerName}}</view>
						</view>
						<view class="form-item" >
							<view class="title">手机号:</view>
							<view class="input phoneCall" @click="phoneCall(item.makerPhone)">{{item.makerPhone}}</view>
						</view>
						<view class="form-item" >
							<view class="title">制单时间:</view>
							<view class="input">{{item.makeTime}}</view>
						</view>
						<view class="form-item" v-if="item.confirmTime">
							<view class="title">确认时间:</view>
							<view class="input">{{item.confirmTime}}</view>
						</view>
						<view class="form-item" >
							<view class="title">货单:</view>
							<view class="input">
								<u-image @click="previewImg(item.fileList)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.fileList).list" ></u-image>
								<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.fileList).file" ></u-image>
								<button type="primary" v-if="item.orderStat == '0' && item.bookPhone == bindPhone " @click="openConformModal(item)">确认</button>
							</view>
						</view>
					</view>
				</u-card>
				<u-empty text="暂无相关内容" mode="list" v-if="tableList.length == 0"></u-empty>
				<view class="loadingWarp" v-if="showLoading">
					<u-loading size="70" color="#3498db"></u-loading>
				</view>
				<view class="bottom-block" >.</view>
			</scroll-view>
			<u-modal v-model="showModal" ref="uModal" negative-top="400" show-cancel-button cancel-text="取消" :async-close="true" @confirm="goConfirm()" @cancel="showModal=false">
				<view class="tipsContent" >
					请仔细核对订单信息，我公司将严格按照订单规格数量生产并安排发货<br>
					点击 <view class="boldFont">确认</view> 进行确认操作.
					<input style="margin-top: 10px;" class="input" name="input"  v-model="input.bookName" placeholder="姓名" />
					<input class="input" name="input"  v-model="input.bookIdNum" placeholder="身份证号" />
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
					orderNo: "",
					orderStat: "",
					page: 1, // 页数
					pageNum: 10,
					keyword: '',
					ywyName: '',
					makerName: '',
				},
				input: {
					bookName: '',
					bookIdNum: ''
				},
				total: 0,
				showLoading: false,
				tableList: [],
				showModal: false,
				nowItem: {},
				pageLoading: false,
				bindPhone: '',
				deviceInfo: {}
			}
		},
		watch: {},
		onLoad(options) {
			let info = JSON.parse(uni.getStorageSync('userInfo'));
			this.bindPhone = info.phone +'';
			console.log(info,'用户信息')
			this.getData();
			try {
				const res = uni.getSystemInfoSync();
				let {model,brand,version,platform} = res;
				this.deviceInfo = {
					model,brand,version,platform
				}
				console.log(this.deviceInfo,'保存的信息')
			} catch (e) {
				console.log(e,'获取失败')
			}
		},
		methods: {
			// scroll-view到底部加载更多
			onreachBottom() {
				if (this.searchForm.pageNum >= this.total) {
					uni.showToast({
						icon: 'none',
						title: '已经没有更多了~'
					})
					return
				}
				this.searchForm.pageNum += 10;
				this.getMoreData();
			},
			phoneCall(phone) {
				console.log(phone);
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
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
						if(this.$judgeFiletype.isImageFn(ele.filename)) {
							list.push(this.$imgBaseUrl + ele.filename)
						} else {
							file.push(this.$imgBaseUrl + ele.filename);
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
				let param = {...this.searchForm};
				param.keyword = param.keyword + this.bindPhone;
				this.$request('/orderForm', 'GET', param).then(res => {
					this.tableList = res.list
					console.log(this.tableList)
					this.total = res.pages.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				let param = {...this.searchForm};
				param.keyword = param.keyword + this.bindPhone;
				this.$request('/orderForm', 'GET', param).then(res => {
					this.tableList = res.list
					this.total = res.pages.total;
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
				this.input.bookIdNum = '';
				this.input.bookName = '';
				this.nowItem = item;
				this.showModal = true;
				this.$refs.uModal.clearLoading();
			},
			goConfirm() {
				console.log(this.nowItem)
				
				// 校验流程
				if(!this.input.bookName) {  //校验姓名
					uni.showToast({
						icon: 'none',
						title: '请填写姓名'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				
				if(!this.input.bookIdNum && this.nowItem.bookIdNum) {  //校验姓名
					uni.showToast({
						icon: 'none',
						title: '请填写身份证号'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				
				// 校验输入的内容是否和订单一致
				if(this.input.bookName != this.nowItem.bookName) {
					uni.showToast({
						icon: 'none',
						title: '姓名与订单不一致'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				
				// 校验输入的内容是否和订单一致
				if(this.nowItem.bookIdNum && this.nowItem.bookIdNum != this.input.bookIdNum) {
					uni.showToast({
						icon: 'none',
						title: '身份证号与订单不一致'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				
				console.log('通过判空校验')
				
				let canGetLocation = false;  //判断是否能获取地址
				
				
				uni.getLocation({
				    type: 'wgs84',
				}).then((res)=>{
					console.log(res[0],res[1])
					if(res[0]) {
						console.log('无权限获取')
						uni.showToast({
							icon: 'none',
							title: '请允许获取当前位置信息,点击 ··· 设置中允许获取。'
						})
						this.$refs.uModal.clearLoading();
						return
					}
					canGetLocation = true;
					console.log('当前位置的经度：' + res[1].longitude);
					console.log('当前位置的纬度：' + res[1].latitude);
					
					let locationJson = JSON.stringify({lat:res[1].longitude,lon:res[1].latitude})
									
					
					if(this.nowItem.bookIdNum) {  // 身份证存在 走校验
					// TODO 必须先获取 因为只有30天有效
					// 获取 身份校验 accesstoken    30天有效  24.a527eb57a17d291d97e752b1d06f89c1.2592000.1641892949.282335-25332674
					// 
						let accessToken = null;
						uni.request({
							url: 'https://aip.baidubce.com/oauth/2.0/token',
							method: 'GET',
							header: {},
							data: {
								"grant_type": 'client_credentials', 
								"client_id": 'tImTfCkl7UmYhU6Wv4Zzghv4',
								"client_secret": 'aNEyU626GgYt8vc2Aip2TGEy4eKE8GC9'
							},
							dataType: 'json',
							timeout: 300000,
						}).then(access=>{
							console.log(access)
							if(access[1]) {
								console.log('获取成功',console.log(access))
								accessToken = access[1].data.access_token;
							}
							if(!accessToken) {
								uni.showToast({
									icon: 'none',
									title: 'AccessToken 获取失败'
								})
								return
							}
							console.log('获取accesstoken',accessToken)
							uni.request({
								url: 'https://aip.baidubce.com/rest/2.0/face/v3/person/idmatch?access_token='+accessToken,
								method: 'POST',
								header: {},
								data: {
									"id_card_number": this.input.bookIdNum, 
									"name": this.input.bookName
								},
								dataType: 'json',
								timeout: 300000,
							}).then(res=>{
								this.$refs.uModal.clearLoading();
								if(res[1].data.error_code == 0) {
									uni.showToast({
										icon: 'none',
										title: '校验成功'
									})
									let param = {...this.nowItem};
									param.orderStat = '1';
									param.location = locationJson;
									param.deviceInfo = JSON.stringify(this.deviceInfo);
									this.$request('/orderForm/editOrder', 'POST', param).then(res => {
										console.log(res);
										uni.showToast({
											icon: 'none',
											title: '确认成功'
										})
										this.showModal = false;
										this.getData();
									})
								} else {
									uni.showToast({
										icon: 'none',
										title: '身份信息校验失败'
									})
								}
							})
						})
						return
					}
					
					// 不存在身份证号校验输入的信息
					if(this.input.bookName == this.nowItem.bookName) {
						console.log('校验通过')
						let param = {...this.nowItem};
						param.location = locationJson;
						param.deviceInfo = JSON.stringify(this.deviceInfo);
						param.orderStat = '1';
						this.$request('/orderForm/editOrder', 'POST', param).then(res => {
							console.log(res);
							this.$refs.uModal.clearLoading();
							uni.showToast({
								icon: 'none',
								title: '确认成功'
							})
							this.showModal = false;
							this.getData();
							
						})
					}
					
				})
				
			},
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
					width: 70px;
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
	.tipsContent {
		.input {
			border: 1rpx solid #848484;
			font-size: 14px;
			border-radius: 10rpx;
			margin-bottom: 5px;
			padding-left: 10px;
		}
	}
</style>
