<template>
	<view class="content">
		<!-- 发货单查看 -->
		<u-search :clearabled="true" input-align="left" v-model="searchForm.orderNo" placeholder="请输入单号" @search="getData"  @custom="getData" @clear="getData"></u-search>
		<u-tabs ref="uTabs" v-if="!isComponent" class="utabs" :list="list" :is-scroll="false":current="current" @change="changeTab">
		</u-tabs>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) in tabsView" :key="index">
				<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-triggered="refreshTrigger" :refresher-threshold="70"
					refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh" @scrolltolower="onreachBottom">
					<u-card margin="10px 5px 15px 5px" class="ucard" v-for="item in tableList" :key="item.orderNo">
						<view slot="head" class="head">
							<view class="headTips">
								<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
								{{item.orderNo}}
							</view>
							<u-tag type="warning" v-if="item.orderStat == '0'" text="待启运" mode="dark" :closeable="false" />
							<u-tag 				  v-if="item.orderStat == '1'" text="运输中" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.orderStat == '2'" text="已签收" mode="dark" :closeable="false" />
							<u-tag type="warning" v-if="item.orderStat == '3'" text="已签收(有异议)" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.orderStat == '4'" text="已签收(二次确认)" mode="dark" :closeable="false" />
							<u-tag type="info"    v-if="item.orderStat == '9'" text="已销毁" mode="dark" :closeable="false" />

						</view>
						<view slot="body" class="body">
							<view class="form-item" >
								<view class="title">客户:</view>
								<view class="input">{{item.company}}</view>
							</view>
							<view class="form-item" >
								<view class="title">现场联系人:</view>
								<view class="input">{{item.liveName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.livePhone)">{{item.livePhone}}</view>
							</view>
							<view class="form-item">
								<view class="title">司机:</view>
								<view class="input">{{item.deliveryName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.deliveryPhone)">{{item.deliveryPhone}}</view>
							</view>
							<view class="form-item">
								<view class="title">业务员:</view>
								<view class="input">{{item.ywyName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.ywyPhone)">{{item.ywyPhone}}</view>
							</view>
							<view class="form-item" v-if="item.changeName">
								<view class="title">变更收货人:</view>
								<view class="input">{{item.changeName}}</view>
							</view>
							<view class="form-item" v-if="item.changePhone">
								<view class="title">变更手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.changePhone)">{{item.changePhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">制单时间:</view>
								<view class="input">{{item.makeTime}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.fileList)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.fileList).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.fileList).file" ></u-image>
									<br>
								</view>
							</view>
							<view class="form-item" >
								<view class="button-box">
									<button type="default" class="blue" v-if="item.orderStat == '1' && userInfo.phone == item.payPhone" @click="openChangeModal(item)">变更收货人</button>
									<!-- 不存在变更人 或者  变更手机号与登录一致 -->
									<template v-if="!item.changePhone ||  (item.changePhone && userInfo.phone == item.changePhone) " >
										<button type="primary" class="orange" v-if="item.orderStat == '1'" @click="openSignModal(item,'1')">有异议签收</button>
										<button type="primary" v-if="item.orderStat == '1'" @click="openSignModal(item,'0')">无异议签收</button>
										<button type="primary" class="orange" v-if="item.orderStat == '3'" @click="openSignModal(item,'0')">二次签收</button>
									</template>
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
			</swiper-item>
		</swiper>
		
		<!--签收弹层 -->
		<u-modal v-model="showModal" :async-close="true" ref="uModal" negative-top="500" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
			<view class="tipsContent" >
				<template v-if="signType == '0'" >
					本人对上述货物的数量及金额确认无误，作为双方的结算依据. <br />
					点击 <view class="boldFont">确认</view> 进入无异议签收操作.
				</template>
				<template v-else >
					<view>
						<view>异议内容:(小于100字)</view>
						<u-input v-model="input.problem" type="textarea" placeholder="请输入" :border="true" :maxlength="100" />
					</view>
				</template>
				<input style="margin-top: 10px;" class="input" name="input"  v-model="input.payName" placeholder="姓名" />
				<input class="input" name="input"  v-model="input.payIdNum" placeholder="身份证" />
			</view>
		</u-modal>
		
		<!--变更收货人弹层 -->
		<u-modal v-model="showChangeModal" :async-close="true" ref="uModal2" negative-top="500" show-cancel-button cancel-text="取消" @confirm="changeConfirm()" @cancel="showChangeModal=false">
			<view class="tipsContent" >
				变更收货人(请填写完整信息) <br />
				
				点击 <view class="boldFont">确认</view> 进入变更操作.
				<input style="margin-top: 10px;" class="input" name="input"  v-model="changeInput.changeName" placeholder="姓名" />
				<input style="margin-top: 10px;" class="input" name="input"  v-model="changeInput.changePhone" placeholder="手机号" />
				<input class="input" name="input"  v-model="changeInput.changeIdNum" placeholder="身份证" />
			</view>
		</u-modal>
		
		
	</view>
</template>

<script>
	export default {
		name: 'DispatchOrder',
		props:{
			isComponent: {
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				list: [{
					name: '全部'
				}, {
					name: '待启运'
				}, {
					name: '已签收'
				}],
				tabsView: [{
					name: '全部'
				}, {
					name: '待启运'
				}, {
					name: '已签收'
				}],
				current: 0,
				swiperCurrent: 0,
				refreshTrigger: false,
				fileLists:[{
					url:'../../static/image/orderImg.png',
					extname:'png',
					name:'shuijiao.png'
				}],
				searchForm: {
					orderNo: "",
					orderStat: "",
					keyword: "",
					page: 1,
					pageNum: 10,
					ywyName: '',
					makerName: '',
				},
				total: 0,
				showLoading: false,
				tableList: [],
				// 当前订单
				nowItem: {},
				showModal: false,
				showChangeModal: false,  // 变更收货人弹层
				signType: '0',  // 0无异议签收 1有异议签收
				input: {
					payName: '',
					payIdNum: '',
					problem: '',  // 异议
				},
				changeInput: {
					changeName: '',
					changePhone: '',
					changeIdNum: '',
				},
				bindPhone: '',
				userInfo: null
			}
		},
		watch:{
			'swiperCurrent':function() {  //监听页面滚动
				this.searchForm.orderNo = '';
				this.getData();
			},
		},
		mounted() {
			
			if(this.isComponent) {
				this.tabsView = [{name: '全部'}];
				// 组件情况分为： 1、客户查看历史订单   2、员工查看全部订单
				
			} else {  //在非组件的情况下 按登录用户把查询信息带上
				let info = JSON.parse(uni.getStorageSync('userInfo'));
				this.userInfo = info;
				this.bindPhone = info.phone +'';
			}
			
			this.getData();
		},
		methods: {
			// 打开签收框
			openSignModal(item,signType) {
				console.log(item)
				this.input.payName = '';
				this.input.payIdNum = '';
				this.input.problem = '';
				this.signType = signType;
				this.nowItem = item;
				this.showModal = true;
			},
			openChangeModal(item) {
				this.changeInput.changeName = '';
				this.changeInput.changeIdNum = '';
				this.changeInput.changePhone = '';
				this.nowItem = item;
				this.showChangeModal = true;
			},
			// 变更收货人
			changeConfirm() {
				let {changeName,changePhone,changeIdNum} = this.changeInput;
				
				if(!changeName || !changePhone || !changeIdNum) {
					uni.showToast({
						icon: 'none',
						title: '请输入完整信息'
					})
					this.$refs.uModal2.clearLoading(); 
					return
				}
				
				let param = {...this.nowItem};
				param.changeName = changeName;
				param.changePhone = changePhone;
				param.changeIdNum = changeIdNum;
				
				this.$request('/dispatchForm/editOrder','POST', param).then(res=>{
					console.log(res,'回参')
					this.$refs.uModal2.clearLoading(); 
					this.pageLoading = false;
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '变更成功！',
						})
						this.showChangeModal = false;
						this.getData();
					} else {
						this.pageLoading = false;
						uni.showToast({
							icon: 'none',
							title: '服务异常'
						})
					}
				})
				.catch(err=>{
					this.$refs.uModal2.clearLoading(); 
					this.pageLoading = false;
					uni.showToast({
						icon: 'none',
						title: '服务异常'
					})
				})
				
				
				
				console.log('确认变更收货人')
			},
			// 确认签收  signType
			goConfirm() {
				this.$refs.uModal.clearLoading();  // 取消确认loading
				
				let canGetLocation = false;  //判断是否能获取地址
				
				uni.getSystemInfo({
				    success: function (res) {
						console.log(res,'手机信息')
				        console.log(res.model,'型号');
				        console.log(res.brand,'品牌');
				        console.log(res.version,'系统版本');
				        console.log(res.platform,'客户端平台');
				    }
				});
				
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
					
					// 校验流程
					if(!this.input.payName) {  //校验姓名
						uni.showToast({
							icon: 'none',
							title: '请填写姓名'
						})
						this.$refs.uModal.clearLoading();
						return
					}
					
					if(!this.input.payIdNum && this.nowItem.payIdNum) {  //校验身份证号
						uni.showToast({
							icon: 'none',
							title: '请填写身份证号'
						})
						this.$refs.uModal.clearLoading();
						return
					}
					
					
					// 校验输入的内容是否和订单一致
					if(this.input.payName != this.nowItem.payName && this.input.payName != this.nowItem.changeName) {
						uni.showToast({
							icon: 'none',
							title: '姓名与订单不一致'
						})
						this.$refs.uModal.clearLoading();
						return
					}
					
					// 校验输入的内容是否和订单一致
					if(this.nowItem.payIdNum && this.nowItem.payIdNum != this.input.payIdNum && this.input.payIdNum != this.nowItem.changeIdNum) {
						uni.showToast({
							icon: 'none',
							title: '身份证号与订单不一致'
						})
						this.$refs.uModal.clearLoading();
						return
					}
					
					
					console.log('通过校验')
					
					if(this.nowItem.payIdNum) {  // 身份证存在 走校验
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
								this.$refs.uModal.clearLoading();
								return
							}
							console.log('获取accesstoken',accessToken)
							uni.request({
								url: 'https://aip.baidubce.com/rest/2.0/face/v3/person/idmatch?access_token='+accessToken,
								method: 'POST',
								header: {},
								data: {
									"id_card_number": this.input.payIdNum, 
									"name": this.input.payName
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
									this.nowItem.signType = this.signType;
									this.nowItem.location = locationJson;
									if(this.signType == '1') {
										this.nowItem.problem = this.input.problem;
									}
									if(this.signType == '0' && this.nowItem.orderStat == '3') {  // 标记为有异议签收的二次确认签收
										this.doneSave(this.nowItem,'4');
										return
									}
									this.doneSave(this.nowItem,this.signType=='0'?'2':'3');
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
					if(this.input.payName == this.nowItem.payName) {
						console.log('校验通过')
						this.nowItem.signType = this.signType;
						if(this.signType == '1') {
							this.nowItem.problem = this.input.problem;
						}
						this.doneSave(this.nowItem,this.signType=='0'?'2':'3');
					}
					
				})

				console.log('校验通过',this.nowItem)
				
			},
			// 更改订单信息
			doneSave(item,stat) {
				
				let changePeople = false;  //标记是否为 变更的收货人
				if(this.userInfo && item.changePhone && this.userInfo.phone == item.changePhone) {
					changePeople = true;
					console.log('当前为代收操作')
				}
				
				this.pageLoading = true;
				let param = {...item};
				param.orderStat = stat;  //变更为 运输中状态
				console.log(param,'签收传参')
				this.$request('/dispatchForm/editOrder','POST', param).then(res=>{
					console.log(res,'回参')
					this.$refs.uModal.clearLoading();
					this.pageLoading = false;
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '货物签收成功！',
						})
						this.showModal = false;
						this.getData();
					} else {
						this.pageLoading = false;
						uni.showToast({
							icon: 'none',
							title: '服务异常'
						})
					}
				})
				.catch(err=>{
					this.$refs.uModal.clearLoading();
					this.pageLoading = false;
					uni.showToast({
						icon: 'none',
						title: '服务异常'
					})
				})
			},
			changeTab(tab) {
				this.current = tab;
				this.swiperCurrent = tab;
				if(tab == 1) {
					this.searchForm.orderStat = tab - 1;
				} else if(tab == 2){
					this.searchForm.orderStat = tab + 1;
				} else {
					this.searchForm.orderStat = '';
				}
				
			},
			transition(e) {
				let dx = e.detail.dx;
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.swiperCurrent = current;
				this.current = current;
				if(current == 1 ) {
					this.searchForm.orderStat = current - 1;
				} else if( current == 2){
					this.searchForm.orderStat = current + 1;
				} else {
					this.searchForm.orderStat = '';
				}
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if(this.searchForm.pageNum >= this.total) {
					uni.showToast({
						icon: 'none',
						title: '已经没有更多了~'
					})
					return
				}
				this.searchForm.pageNum += 10;
				this.getMoreData();
			},
			// scroll-view 下拉刷新
			refresherrefresh() {
				this.refreshTrigger = true;
				this.getData();
			},
			phoneCall(phone) {
				console.log(phone);
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
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
				this.$request('/dispatchForm','GET',param).then(res=>{
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
				this.$request('/dispatchForm','GET',param).then(res=>{
					this.tableList = res.list
					this.total = res.pages.total;
				})
			},
			copy(info) {
				uni.setClipboardData({
				    data: info,
				    success: function () {
				        console.log('复制成功');
				    }
				});
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
					min-width: 70px;
					margin-right: 2px;
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
				}
				.button-box {
					display: flex;
					justify-content: flex-end;
					width: 100%;
					button {
						font-size: 14px;
						margin-left: 10px;
						width: 100px;
						display: inline-block;
					}
					.blue {
						background-color: #2979ff;
						color: #fff;
					}
					.orange {
						background-color: #ff9900;
					}
				}
			}
		}
		.ucard:nth-last-child(1){
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
		background-color: rgba(255,255,255,0.1);
		transition: all 0.5s ease-in-out;
	}
	
	.tipsContent {
		.form-item {
			display: flex;
			font-size: 15px;
			margin-bottom: 2px;
		
			.title {
				font-size: 15px;
				min-width: 70px;
				margin-right: 2px;
				color: #333;
			}
		
			.inputText {
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
</style>
