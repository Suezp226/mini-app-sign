<template>
	<view class="content">
		<u-search :clearabled="true" input-align="left" v-model="searchForm.orderNo" placeholder="请输入单号" @search="getData"  @custom="getData" @clear="getData"></u-search>
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
								{{item.orderNo}}
							</view>
							<u-tag type="primary"  v-if="item.orderStat == '0'" text="待确认" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.orderStat == '1'" text="已确认" mode="dark" :closeable="false" />
							<u-tag type="info" v-if="item.orderStat == '9'" text="已销毁" mode="dark" :closeable="false" />
						</view>
						<view slot="body" class="body">
							<view class="form-item" >
								<view class="title">客户:</view>
								<view class="input">{{item.company}}</view>
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
								<view class="title">财务:</view>
								<view class="input">{{item.finaceName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">手机号:</view>
								<view class="input phoneCall" @click="phoneCall(item.finacePhone)">{{item.finacePhone}}</view>
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
								<view class="title">制单时间:</view>
								<view class="input">{{item.confirmTime}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<u-image @click="previewImg(item.fileList)" width="60px" height="60px" :src="src" class="file-box" v-for="(src,ind) in getFileList(item.fileList).list" ></u-image>
									<u-image @click="goFile(src)" width="60px" height="60px" :src="'/static/image/'+ $judgeFiletype.isFileFn(src) +'Icon.png'" class="file-box" v-for="(src,i) in getFileList(item.fileList).file" ></u-image>
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
	</view>
</template>

<script>
	export default {
		name: 'StatementOrder',
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
					name: '待确认'
				}, {
					name: '已销毁'
				}],
				tabsView: [{
					name: '全部'
				}, {
					name: '待确认'
				}, {
					name: '已销毁'
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
					page: 1, // 页数
					pageNum: 10,
					keyword: '',
					ywyName: '',
					makerName: '',
				},
				total: 0,
				showLoading: false,
				tableList: [],
				bindPhone: ''
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
			} else {
				let info = JSON.parse(uni.getStorageSync('userInfo'));
				this.bindPhone = info.phone +'';
			}
			this.getData();
		},
		methods: {
			changeTab(tab) {
				this.current = tab;
				this.swiperCurrent = tab;
				if(tab == 0) {
					this.searchForm.orderStat = '';
				} else if( tab ==2 ){
					this.searchForm.orderStat = '9';
				} else {
					this.searchForm.orderStat = '0';
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
				if(current != 0) {
					this.searchForm.orderStat = '9';
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
				this.$request('/statementForm','GET',param).then(res=>{
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
				this.$request('/statementForm','GET',param).then(res=>{
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
					width: 70px;
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
