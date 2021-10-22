<template>
	<view class="content">
		<!-- 发货单查看 -->
		<u-search :clearabled="true" input-align="left" v-model="searchForm.invoiceCode" placeholder="请输入订单号" @search="getData"  @custom="getData" @clear="getData"></u-search>
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
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.custPhone)">{{item.custPhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">时间:</view>
								<view class="input">{{new Date(item.makerTime).toLocaleString()}}</view>
							</view>
							<view class="form-item" v-if="item.receiveName">
								<view class="title">变更收货人:</view>
								<view class="input phoneCall" @click="phoneCall(item.receiveName)">{{item.receiveName}}</view>
							</view>
							<view class="form-item" v-if="item.receivePhone">
								<view class="title">变更手机号:</view>
								<view class="input">{{item.receivePhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.invoiceImage)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,index) in getFileList(item.invoiceImage).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,index) in getFileList(item.invoiceImage).file" ></u-image>
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
				tableList: []
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
					image {
						height: 70px;
						width: 70px;
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
