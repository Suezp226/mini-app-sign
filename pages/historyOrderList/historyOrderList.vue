<template>
	<view class="content">
		<!-- 这里用来 给 客户、 收货人员 查看 历史相关的订单 -->
		<u-tabs ref="uTabs" class="utabs" :list="list" :is-scroll="false" :current="current" @change="changeTab">
		</u-tabs>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" :refresher-threshold="90"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) in tabsView" :key="index">
				<order-list v-if="swiperCurrent == 0" :isComponent="true"></order-list>
				<DispatchOrder v-if="swiperCurrent == 1" :isComponent="true"></DispatchOrder>
				<StatementOrder v-if="swiperCurrent == 2" :isComponent="true"></StatementOrder>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import OrderList from '../orderManageList/orderList.vue';
	import DispatchOrder from '../orderManageList/dispatchOrder.vue';
	import StatementOrder from '../orderManageList/statementOrder.vue';
	export default {
		components: {
			OrderList,
			DispatchOrder,
			StatementOrder
		},
		data() {
			return {
				list: [{
					name: '订货单'
				}, {
					name: '发货单'
				}, {
					name: '对账单'
				}],
				tabsView: [{
					name: '订货单'
				}, {
					name: '发货单'
				}, {
					name: '对账单'
				}],
				current: 0,
				swiperCurrent: 0,
				refreshTrigger: false,
				fileLists:[{
					url:'../../static/image/orderImg.png',
					extname:'png',
					name:'shuijiao.png'
				}]
			}
		},
		onLoad(options) {
			let pages = getCurrentPages();
			console.log(pages)
			if(options.type) {
				this.current = options.type;
				this.swiperCurrent = options.type;
			}
		},
		onUnload() {  //监听页面卸载 如果是百度人脸过来的 返回直接跳转首页
			let pages = getCurrentPages();
			if(['pages/confirmOrder/confirmOrder','pages/signIn/signIn'].includes(pages[pages.length-1].route)) {
				console.log('zhixing ')
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		methods: {
			changeTab(tab) {
				console.log(tab)
				this.current = tab;
				this.swiperCurrent = tab;
			},
			transition(e) {
				let dx = e.detail.dx;
				// this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				// this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},
			// scroll-view到底部加载更多
			onreachBottom() {

			},
			// scroll-view 下拉刷新
			refresherrefresh() {
				console.log('下拉刷新')
				this.refreshTrigger = true;
				setTimeout(() => {
					this.refreshTrigger = false;
				}, 500)
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
	}

	.swiper {
		flex: 1;
		flex-direction: column;
	}

	.scrollView {
		height: 100%;
		width: 100%;
		padding: 10px;
		box-sizing: border-box;
	}
</style>
