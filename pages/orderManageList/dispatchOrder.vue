<template>
	<view class="content">
		<!-- 发货单查看 -->
		<u-search :clearabled="true" input-align="left" v-model="searchForm.invoiceCode" placeholder="请输入单号" @search="getData"  @custom="getData" @clear="getData"></u-search>
		<u-tabs ref="uTabs" v-if="!isComponent" class="utabs" :list="list" :is-scroll="false":current="current" @change="changeTab">
		</u-tabs>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) in tabsView" :key="index">
				<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-triggered="refreshTrigger" :refresher-threshold="70"
					refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh" @scrolltolower="onreachBottom">
					<u-card margin="10px 5px 15px 5px" class="ucard" v-for="item in tableList" :key="item.moId">
						<view slot="head" class="head">
							<view class="headTips">
								<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
								{{item.invoiceCode}}
							</view>
							<u-tag type="warning" v-if="item.invoiceStat == '0'" text="待启运" mode="dark" :closeable="false" />
							<u-tag 				  v-if="item.invoiceStat == '1'" text="运输中" mode="dark" :closeable="false" />
							<u-tag type="warning" v-if="item.invoiceStat == '2'" text="待签收" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.invoiceStat == '3'" text="已签收" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.invoiceStat == '4'" text="已签收(有异议)" mode="dark" :closeable="false" />
							<u-tag type="info"    v-if="item.invoiceStat == '9'" text="已销毁" mode="dark" :closeable="false" />

						</view>
						<view slot="body" class="body">
							<view class="form-item" >
								<view class="title">客户:</view>
								<view class="input">{{item.custName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">收货人:</view>
								<view class="input">{{item.custHandler}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.custPhone)">{{item.custPhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">时间:</view>
								<view class="input">{{new Date(item.makerTime).toLocaleDateString()}}</view>
							</view>
							<view class="form-item" v-if="item.receiveName">
								<view class="title">变更收货人:</view>
								<view class="input">{{item.receiveName}}</view>
							</view>
							<view class="form-item" v-if="item.receivePhone">
								<view class="title">变更手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.receivePhone)">{{item.receivePhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.invoiceImage)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.invoiceImage).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.invoiceImage).file" ></u-image>
									<!--  -->
									<button type="primary" v-if="item.invoiceStat == '4'" @click="openSignModal(item)">确认签收</button>
								</view>
							</view>
						</view>
					</u-card>
					<u-empty text="暂无相关内容" mode="list" v-if="tableList.length == 0"></u-empty>
					<view class="loadingWarp" v-if="showLoading">
						<u-loading size="70" color="#3498db"></u-loading>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
		<!-- 二次签收弹层 -->
		<u-modal v-model="showModal" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
			<view class="tipsContent" >
				货物签收确认，<br>
				本人对上述货物的数量及金额确认无误，作为双方的结算依据。 <br>
				点击 <view class="boldFont">确认</view> 进入人脸识别确认签收.
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
					invoiceCode: "",
					custName: "",
					busiManName: "", //业务员
					makerName: "",  //销售内勤
					driverName: "", // 司机
					invoiceStat: "",
					offset: 0,
					limit: 10,
				},
				total: 0,
				showLoading: false,
				tableList: [],
				// 二次签收
				nowItem: {},
				showModal: false,
				haveMsg: 0,  // 无异议
				confirmMsg: '', // 异议内容
			}
		},
		watch:{
			'swiperCurrent':function() {  //监听页面滚动
				this.searchForm.invoiceCode = '';
				this.getData();
			},
		},
		onUnload() {  //监听页面卸载 如果是百度人脸过来的 返回直接跳转首页
			let pages = getCurrentPages();
			if(['pages/startRunning/startRunning'].includes(pages[pages.length-1].route)) {
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		mounted() {
			
			if(this.$store.state.userPosition == 'shr') {
				this.list = [ {
					name: '已签收'
				}];
				this.tabsView = [ {
					name: '已签收'
				}];
				this.searchForm.invoiceStat = 3;
			}
			
			if(this.isComponent) {
				this.tabsView = [{name: '全部'}];
				// 组件情况分为： 1、客户查看历史订单   2、员工查看全部订单
				let info = JSON.parse(uni.getStorageSync('userInfo'));
				if(['kh'].includes(info.roleCode) ) {
					this.searchForm.custName = info.userName;
				}
				
				if(['shr'].includes(info.roleCode) ) {
					this.searchForm.receiveName = info.userName;
				}
				
			} else {  //在非组件的情况下 按登录用户把查询信息带上
				if(this.$store.state.userPosition == 'sj') {
					this.searchForm.driverName = this.$store.state.userInfo.userName
				}
				if(this.$store.state.userPosition == 'xsnq') {
					this.searchForm.makerName = this.$store.state.userInfo.userName
				}
				if(this.$store.state.userPosition == 'ywy') {
					this.searchForm.busiManName = this.$store.state.userInfo.userName
				}
			}
			
			this.getData();
		},
		methods: {
			// 二次签收
			openSignModal(item) {
				this.nowItem = item;
				console.log(this.nowItem.invoiceImage)
				this.showModal = true;
			},
			goConfirm() {
				let nowUrl = window.location.href;
				this.$request('/face/getAuth','POST',{}).then(res=>{
					console.log(res.data.access_token,JSON.parse(res.data.verify_token).result.verify_token,'回参')
					let accToken = res.data.access_token;
					let token = JSON.parse(res.data.verify_token).result.verify_token;
					let local = window.location.host;
					let successUrl;
					if(this.$store.state.userInfo.roleCode == 'shr') { //收货人
						successUrl = encodeURIComponent(`http://${local}/#/pages/signIn/signIn?code=${this.nowItem.invoiceCode}${this.haveMsg?('&msg='+this.confirmMsg):''}&name=${this.$store.state.userInfo.userName}&atoken=${accToken}&vtoken=${token}`);
					} else { // 客户
						successUrl = encodeURIComponent(`http://${local}/#/pages/signIn/signIn?code=${this.nowItem.invoiceCode}${this.haveMsg?('&msg='+this.confirmMsg):''}&name=${this.$store.state.userInfo.roleName}&atoken=${accToken}&vtoken=${token}`);
					}
					let faillUrl = encodeURIComponent(`http://${local}/#/pages/orderManageList/dispatchOrder`);
					window.location.href = `https://brain.baidu.com/face/print/?token=${token}&
					successUrl=${successUrl}&
					failedUrl=${faillUrl}`
				})
			},
			// 人脸核验 成功
			confirmSuccess(options) {
				console.log(options)
				let query = {
					invoiceCode: options.code,
					custName: "",
					busiManName: "", //业务员
					makerName: "", //销售内勤
					invoiceStat: "",
					offset: 0,
					limit: 10,
				};
				
				// 确认
				this.$request('/baidu/rpc/2.0/brain/solution/faceprint/result/detail?access_token='+options.atoken,'POST',{"verify_token": options.vtoken})
				.then(res=>{
					console.log(res,'获取结果')
					let conformRes = res;
					if(res.success && res.result.idcard_confirm.name == options.name) {
						// 验证成功
						this.pageLoading = false;
						uni.showToast({
							icon: 'success',
							title: '人脸核验成功',
						})
						setTimeout(()=>{
							this.$request('/mallInvoice/query', 'POST', query).then(res2 => {
								let param = res2.data.list[0];
								param.invoiceStat = '3';  //无异议
								if(options.msg) {
									param.invoiceStat = '4';  //4为有异议
									param.suggest = options.msg;
								}
								//  保存 签收人 身份证号
								param.receiveIdnum = conformRes.result.idcard_confirm.idcard_number;
								this.doneSave(param);
							})
						},500)
					} else {
						this.pageLoading = false;
						uni.showToast({
							icon: 'error',
							title: '人脸信息与订单不符',
						})
					}
				})
			},
			// 更改订单信息
			doneSave(param) {
				this.pageLoading = true;
				this.$request('/mallInvoice/save','POST', param).then(res=>{
					console.log(res,'回参')
					this.pageLoading = false;
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '货物签收成功！',
						})
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/historyOrderList/historyOrderList?type=1'
							})
						},1500)
					} else {
						this.pageLoading = false;
						uni.showToast({
							icon: 'success',
							title: '服务异常'
						})
					}
				})
				.catch(err=>{
					this.pageLoading = false;
					uni.showToast({
						icon: 'success',
						title: '服务异常'
					})
				})
			},
			changeTab(tab) {
				this.current = tab;
				this.swiperCurrent = tab;
				if(tab == 1) {
					this.searchForm.invoiceStat = tab - 1;
				} else if(tab == 2){
					this.searchForm.invoiceStat = tab + 1;
				} else {
					this.searchForm.invoiceStat = '';
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
					this.searchForm.invoiceStat = current - 1;
				} else if( current == 2){
					this.searchForm.invoiceStat = current + 1;
				} else {
					this.searchForm.invoiceStat = '';
				}
			},
			// scroll-view到底部加载更多
			onreachBottom() {
				if(this.searchForm.limit >= this.total) {
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
				if(this.$store.state.userPosition == 'shr' && !this.$store.state.userInfo.userName) {
					uni.showToast({
						icon: 'none',
						title: '无访问权限'
					})
					return
				}
				console.log(this.current);
				this.showLoading = true;
				this.tableList = [];
				this.$request('/mallInvoice/query','POST',this.searchForm).then(res=>{
					this.tableList = res.data.list
					res.data.list.forEach((ele,i)=>{
						this.tableList[i].invoiceImage = JSON.parse(ele.invoiceImage);
					})
					this.total = res.data.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				this.$request('/mallInvoice/query','POST',this.searchForm).then(res=>{
					this.tableList = res.data.list
					this.total = res.data.total;
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
					min-width: 50px;
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
					button {
						position: absolute;
						right: -13px;
						bottom: -35px;
						font-size: 14px;
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
		background-color: rgba(255,255,255,0.1);
		transition: all 0.5s ease-in-out;
	}
</style>
