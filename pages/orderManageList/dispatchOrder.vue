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
								<view class="title">结算人:</view>
								<view class="input">{{item.payName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.payPhone)">{{item.payPhone}}</view>
							</view>
							<view class="form-item" v-if="item.changeName">
								<view class="title">变更收货人:</view>
								<view class="input">{{item.changeName}}</view>
							</view>
							<view class="form-item" v-if="item.changePhone">
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.changePhone)">{{item.changePhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">制单时间:</view>
								<view class="input">{{item.makeTime}}</view>
							</view>
							<view class="form-item" v-if="item.bootUpTime">
								<view class="title">启运时间:</view>
								<view class="input">{{item.bootUpTime}}</view>
							</view>
							<view class="form-item" v-if="item.signTime">
								<view class="title">签收时间:</view>
								<view class="input">{{item.bootUpTime}}</view>
							</view>
							<view class="form-item" v-if="item.signTime2">
								<view class="title">二次签收时间:</view>
								<view class="input">{{item.signTime2}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.fileList)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.fileList).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.fileList).file" ></u-image>
									<!--  -->
									<button type="primary" v-if="item.orderStat == '4'" @click="openSignModal(item)">确认签收</button>
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
				// 二次签收
				nowItem: {},
				showModal: false,
				haveMsg: 0,  // 无异议
				confirmMsg: '', // 异议内容
				bindPhone: '',
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
				let info = JSON.parse(uni.getStorageSync('userInfo'));
			} else {  //在非组件的情况下 按登录用户把查询信息带上
				let info = JSON.parse(uni.getStorageSync('userInfo'));
				this.bindPhone = info.phone +'';
			}
			
			this.getData();
		},
		methods: {
			// 二次签收
			openSignModal(item) {
				this.nowItem = item;
				console.log(this.nowItem.fileList)
				this.showModal = true;
			},
			goConfirm() {
				// 获取 身份校验 accesstoken    30天有效  24.a527eb57a17d291d97e752b1d06f89c1.2592000.1641892949.282335-25332674
				// https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=3EFOUalG1jlfCi3c3Y7XKdBi&client_secret=H9gc8A33fALYHgATu3RKSbSS4nhWnGQ3
				
				//  身份信息校验  https://aip.baidubce.com/rest/2.0/face/v3/person/idmatch?access_token=24.a527eb57a17d291d97e752b1d06f89c1.2592000.1641892949.282335-25332674
				
				
				// uni.request({
				// 	url: 'https://aip.baidubce.com/rest/2.0/face/v3/person/idmatch?access_token=24.a527eb57a17d291d97e752b1d06f89c1.2592000.1641892949.282335-25332674',
				// 	method: 'POST',
				// 	header: {},
				// 	data: {
				// 		"id_card_number": '35032219970226711X', 
				// 		"name": "苏智鹏"
				// 	},
				// 	dataType: 'json',
				// 	timeout: 300000,
				// }).then(res=>{
				// 	console.log(res.data,'校验回参')
				// })
			},
			// 更改订单信息
			doneSave(param) {
				this.pageLoading = true;
				this.$request('/dispatchForm/addOrder','POST', param).then(res=>{
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
							icon: 'none',
							title: '服务异常'
						})
					}
				})
				.catch(err=>{
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
