<template>
	<view class="content">
		<u-tabs ref="uTabs" class="utabs" :list="list" :is-scroll="false" :current="current" @change="changeTab">
		</u-tabs>
		<swiper class="swiper" :current="swiperCurrent" @transition="transition" :refresher-threshold="90"
			@animationfinish="animationfinish">
			<swiper-item v-for="(item, index) in tabsView" :key="index">
				<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-triggered="refreshTrigger"
					refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh" @scrolltolower="onreachBottom">
					<u-card margin="10px 5px 20px 5px" class="ucard">
						<view slot="head" class="head">
							<view class="headTips">
								<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
								XH2021080114
							</view>
							<u-tag type="info" text="待确认" mode="dark" :closeable="false" />
							<!-- <u-tag type="primary" text="运输中" mode="dark" :closeable="false" />
							<u-tag type="success" text="已签收" mode="dark" :closeable="false" /> -->
						</view>
						<view slot="body" class="body">
							<view class="form-item" >
								<view class="title">客户:</view>
								<view class="input">普定县向荣矿业有限公司</view>
							</view>
							<view class="form-item" >
								<view class="title">时间:</view>
								<view class="input">2021-09-18 15:25</view>
							</view>
							<view class="form-item" >
								<view class="title">货单:</view>
								<view class="input">
									<uni-file-picker style="margin-top:5px;" limit="1" readonly :value="fileLists" :imageStyles="{height: '70px',width: '70px'}" file-mediatype="image"></uni-file-picker>
								</view>
							</view>
						</view>
					</u-card>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
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
		onLoad() {

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
