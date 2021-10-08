<template>
	<view class="content">
		<u-search :clearabled="true" input-align="left" v-model="searchForm.acctStatCode" placeholder="请输入订单号" @search="getData"  @custom="getData" @clear="getData"></u-search>
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
								{{item.acctStatCode}}
							</view>
							<u-tag type="primary"  v-if="item.acctStatStat == '0'" text="待确认" mode="dark" :closeable="false" />
							<u-tag type="success" v-if="item.acctStatStat == '1'" text="已确认" mode="dark" :closeable="false" />
							<u-tag type="info" v-if="item.acctStatStat == '9'" text="已销毁" mode="dark" :closeable="false" />
						</view>
						<view slot="body" class="body">
							<view class="form-item" >
								<view class="title">客户:</view>
								<view class="input">{{item.custName}}</view>
							</view>
							<view class="form-item" >
								<view class="title">时间:</view>
								<view class="input">{{new Date(item.makerTime).toLocaleString()}}</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<uni-file-picker style="margin-top:5px;" limit="1" readonly :value="fileLists" :imageStyles="{height: '70px',width: '70px'}" file-mediatype="image"></uni-file-picker>
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
					name: '正常'
				}, {
					name: '已销毁'
				}],
				tabsView: [{
					name: '全部'
				}, {
					name: '正常'
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
					acctStatCode: "",
					custName: "",
					busiManName: "", //业务员
					makerName: "",  //销售内勤
					acctStatStat: "",
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
				this.searchForm.acctStatCode = '';
				this.getData();
			},
		},
		mounted() {
			this.getData();
			if(this.isComponent) {
				this.tabsView = [{name: '全部'}];
				// TODO 需要把 当前用户的身份信息带上
				// this.searchForm.custName = ''
			}
		},
		methods: {
			changeTab(tab) {
				this.current = tab;
				this.swiperCurrent = tab;
				if(tab != 0) {
					this.searchForm.acctStatStat = '9';
				} else {
					this.searchForm.acctStatStat = '';
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
					this.searchForm.acctStatStat = '9';
				} else {
					this.searchForm.acctStatStat = '';
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
			getData() {
				console.log(this.current);
				this.showLoading = true;
				this.tableList = [];
				this.$request('/mallAcctStat/query','POST',this.searchForm).then(res=>{
					this.tableList = res.data.list
					this.total = res.data.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				this.$request('/mallAcctStat/query','POST',this.searchForm).then(res=>{
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
					width: 50px;
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
