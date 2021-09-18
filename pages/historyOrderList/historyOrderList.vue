<template>
	<view class="content">
		<u-tabs ref="uTabs" :list="list" :is-scroll="false" :current="current" @change="changeTab"></u-tabs>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item class="swiper-item" v-for="(item, index) in tabsView" :key="index">
				<scroll-view scroll-y style="height: 800rpx;width: 100%;" @scrolltolower="onreachBottom">
					{{item.name}}
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
					name: '全部'
				}, {
					name: '待确认'
				}, {
					name: '已确认'
				}],
				tabsView: [{
					name: '全部'
				}, {
					name: '待确认'
				}, {
					name: '已确认'
				}],
				current: 0,
				swiperCurrent: 0
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

			}
		}
	}
</script>

<style lang="less">

</style>
