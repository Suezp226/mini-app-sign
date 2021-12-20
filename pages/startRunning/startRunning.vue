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
								<view class="title">目的地:</view>
								<view class="input">{{item.destination}}</view>
							</view>
							<view class="form-item" >
								<view class="title">结算人:</view>
								<view class="input">{{item.payName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.payPhone)">{{item.payPhone}}</view>
							</view>
							<view class="form-item" >
								<view class="title">现场联系人:</view>
								<view class="input">{{item.liveName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.livePhone)">{{item.livePhone}}</view>
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
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.fileList)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.fileList).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.fileList).file" ></u-image>
									<button type="primary" v-if="item.orderStat == '0' && item.deliveryPhone == bindPhone" @click="openBootModal(item)">启运</button>
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
		
		<!-- 启运弹层 -->
		<u-modal v-model="showModal" :async-close="true" ref="uModal" negative-top="500" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
			<view class="tipsContent" >
				请仔细核对订单信息 <br />
				<view class="form-item" >
					<view class="title">车号:</view>
					<view class="inputText">{{nowItem.carNum}}</view>
				</view>
				<view class="form-item" >
					<view class="title">运费:</view>
					<view class="inputText">{{nowItem.deliveryFeeType=='0'?(nowItem.deliveryFee + '元'):'客户运费'}}</view>
				</view>
				<view class="form-item" >
					<view class="title">目的地:</view>
					<view class="inputText">{{nowItem.destination}}</view>
				</view>
				<view class="form-item" >
					<view class="title">货物价值:</view>
					<view class="inputText">{{nowItem.goodsPrice}}元</view>
				</view>
				<view class="form-item" style="display: block;" v-if="nowItem.deliveryIdNum">
					<view>运载人身份证号:</view>
					<view>{{nowItem.deliveryIdNum}}</view>
				</view>
				
				点击 <view class="boldFont">确认</view> 进入启运操作.
				<input style="margin-top: 10px;" class="input" name="input"  v-model="input.deliveryName" placeholder="姓名" />
				<input class="input" name="input"  v-model="input.deliveryPhone" placeholder="手机号" />
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
					name: '待启运'
				}, {
					name: '运输中'
				}],
				tabsView: [ {
					name: '待启运'
				}, {
					name: '运输中'
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
					orderStat: "0",
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
				nowItem: {
					
				},
				showModal: false,
				haveMsg: 0,  // 无异议
				confirmMsg: '', // 异议内容
				input: {
					deliveryName: '',
					deliveryPhone: ''
				},
				bindPhone: '',
				deviceInfo: {}
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
				
			} else {  //在非组件的情况下 按登录用户把查询信息带上
				let info = JSON.parse(uni.getStorageSync('userInfo'));
				this.bindPhone = info.phone +'';
			}
			
			this.getData();
			try {
				const res = uni.getSystemInfoSync();
				let {model,brand,version,platform} = res;
				this.deviceInfo = {
					model,brand,version,platform
				}
				console.log(res,'手机信息')
				console.log(res.model,'型号');
				console.log(res.brand,'品牌');
				console.log(res.version,'系统版本');
				console.log(res.platform,'客户端平台');
			} catch (e) {
				console.log(e,'获取失败')
			}
		},
		methods: {
			// 打开启运
			openBootModal(item) {
				console.log(item)
				this.nowItem = item;
				this.showModal = true;
			},
			// 司机启运仅需要 姓名手机号核对完成就可以启运
			goConfirm() {
				this.$refs.uModal.clearLoading();  // 取消确认loading
				let {deliveryName,deliveryPhone} = this.input;
				let canGetLocation = false;  //判断是否能获取地址
				if( !deliveryName || !deliveryPhone) {
					uni.showToast({
						icon: 'none',
						title: '请输入校验信息'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				if(deliveryName != this.nowItem.deliveryName) {
					uni.showToast({
						icon: 'none',
						title: '姓名与订单不一致'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				if(deliveryPhone != this.nowItem.deliveryPhone) {
					uni.showToast({
						icon: 'none',
						title: '手机号与订单不一致'
					})
					this.$refs.uModal.clearLoading();
					return
				}
				
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
					// 启运货物  更新状态
					this.nowItem.Blocation = locationJson;
					this.nowItem.BdeviceInfo = JSON.stringify(this.deviceInfo);
					this.doneSave(this.nowItem);
					
					
				})			
				console.log('校验通过',this.nowItem)
				
			},
			// 更改订单信息
			doneSave(item) {
				this.pageLoading = true;
				let param = {...item};
				param.orderStat = '1';  //变更为 运输中状态
				this.$request('/dispatchForm/editOrder','POST', param).then(res=>{
					console.log(res,'回参')
					this.pageLoading = false;
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '货物启运成功！',
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
				this.searchForm.orderStat = this.current;
				
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
				this.searchForm.orderStat = this.current;
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
