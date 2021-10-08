<template>
	<view class="content">
		<UserHeader></UserHeader>
		<view class="buttonBox">
			<ul>
				<li @click="goHistory" v-if="['admin','kh'].includes(userPosition)">
					<view class="liBox">
						<image src="../../static/image/history.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">历史订单</view>
				</li>
				<li @click="goAll" v-if="['admin','ywy','xsnq'].includes(userPosition)">
					<view class="liBox">
						<image src="../../static/image/history.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">全部订单</view>
				</li>
				<li>
					<view class="liBox">
						<image src="../../static/image/pen.png" mode="aspectFit"></image>
					</view>
					<view class="liBox">个人信息</view>
				</li>
				<li @click="changePosition">
					<image src="../../static/image/change.png" mode="aspectFit"></image>
					<view class="liBox">切换身份</view>
				</li>
				<li @click="logout">
					<image src="../../static/image/exit.png" mode="aspectFit"></image>
					<view class="liBox">退出登入</view>
				</li>
				<li class="hidden"></li>
				<!-- <li>6</li> -->
			</ul>
			<u-popup v-model="showChangeModel" mode="center" border-radius="10" width="90%" closeable>
				<view class="popupBox">
					<u-radio-group v-model="userPosition" @change="radioGroupChange" :wrap="true" size="20px">
						<u-radio @change="radioChange" v-for="(item, index) in list" :key="index" :name="item.value"
							style="margin-bottom: 20px;" :disabled="item.disabled">
							{{item.name}}
						</u-radio>
					</u-radio-group>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	import UserHeader from '../components/userHeader.vue';
	import {
		mapState
	} from 'vuex';
	export default {
		components: {
			UserHeader
		},
		computed: {
			userPosition: {
				get:function(){
					return this.$store.state.userPosition
				},
					
				set:function(e){
					console.log(e)
				}
			}
		},
		data() {
			return {
				showChangeModel: false,
				list: [{
						name: '管理员',
						value: 'admin',
						disabled: false
					},
					{
						name: '业务员',
						value: 'ywy',
						disabled: false
					},
					{
						name: '销售内勤',
						value: 'xsnq',
						disabled: false
					},
					{
						name: '客户',
						value: 'kh',
						disabled: false
					},
					{
						name: '司机',
						value: 'sj',
						disabled: false
					},
					{
						name: '收货人',
						value: 'shr',
						disabled: false
					},
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				value: 'orange',
			}
		},
		onLoad(options) {
			console.log('接受传参', options)
		},
		methods: {
			logout() {
				uni.reLaunch({
					url: "/pages/login/login?type=logout"
				});
			},
			goHistory() {
				uni.navigateTo({
					url: '/pages/historyOrderList/historyOrderList'
				})
			},
			goAll() {
				uni.navigateTo({
					url: '/pages/allOrderList/allOrderList'
				})
			},
			changePosition() {
				this.showChangeModel = true;
				// this.$store.commit('changePosition',2);
			},
			// 选中某个单选框时，由radio时触发
			radioChange(e) {
				// console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				this.$store.commit('changePosition', e);
				uni.showToast({
					title: '身份修改成功',
					icon: 'success'
				})
				this.showChangeModel = false;
			}
		},
	}
</script>

<style scoped lang="less">
	.content {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		text-align: center;
		background-color: #f5f7fb;
		box-sizing: border-box;

		.buttonBox {
			flex: 1;
			overflow-x: hidden;
			overflow-y: auto;

			ul {
				display: flex;
				flex-wrap: wrap;
				justify-content: center;
				padding: 10px 0 0 0;

				li {
					background-color: #fff;
					box-sizing: border-box;
					display: flex;
					flex-direction: column;
					align-items: center;
					min-width: 135px;
					width: 40%;
					margin: 10px;
					padding: 10px 5px;
					border-radius: 5px;
					box-shadow: 0 0px 7px 1px rgba(0, 0, 0, 0.16);
					height: 116px;

					image {
						height: 62px;
						width: 40px;
					}

					.liBox {
						width: 100%;
						display: block;
					}
				}
				.hidden {
					opacity: 0;
				}
			}
		}

		.popupBox {
			padding: 40px 20px 10px 60px;
		}

		@media screen and (max-width: 350px) {
			.buttonBox ul li {
				width: 135px !important;
			}
		}
	}
</style>
