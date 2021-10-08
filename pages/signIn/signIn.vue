<template>
	<view class="content">
		<u-search :clearabled="true" input-align="left" v-model="searchForm.orderCode" placeholder="请输入订单号"
			@search="getData" @custom="getData" @clear="getData"></u-search>
		<view style="flex: 1;overflow: hidden;" >
			<scroll-view scroll-y class="scrollView" refresher-enabled :refresher-triggered="refreshTrigger"
				:refresher-threshold="65" refresher-background="#f5f7fb" @refresherrefresh="refresherrefresh"
				@scrolltolower="onreachBottom">
				<u-card margin="10px 5px 15px 5px" class="ucard" v-for="item in tableList" :key="item.moId">
					<view slot="head" class="head">
						<view class="headTips">
							<u-icon name="car" color="rgb(77, 193, 177)" size="30" style="margin-right: 10px;"></u-icon>
							{{item.invoiceCode}}
						</view>
						<u-tag type="primary" v-if="item.invoiceStat == '1'" text="运输中" mode="dark" :closeable="false" />
						<u-tag type="info" v-if="item.invoiceStat == '2'" text="待签收" mode="dark" :closeable="false" />
						<u-tag type="success" v-if="item.invoiceStat == '3'" text="已签收" mode="dark" :closeable="false" />
						<u-tag type="info" v-if="item.invoiceStat == '9'" text="已销毁" mode="dark" :closeable="false" />
					</view>
					<view slot="body" class="body">
						<view class="form-item">
							<view class="title">客户:</view>
							<view class="input">{{item.custName}}</view>
						</view>
						<view class="form-item">
							<view class="title">时间:</view>
							<view class="input">{{new Date(item.makerTime).toLocaleString()}}</view>
						</view>
						<view class="form-item" v-if="item.receiveName">
							<view class="title">变更收货人:</view>
							<view class="input">{{item.receiveName}}</view>
						</view>
						<view class="form-item" v-if="item.receivePhone">
							<view class="title">变更手机号:</view>
							<view class="input">{{item.receivePhone}}</view>
						</view>
						<view class="form-item">
							<view class="title">货单:</view>
							<view class="input">
								<uni-file-picker style="margin-top:5px;" limit="1" readonly :value="fileLists"
									:imageStyles="{height: '70px',width: '70px'}" file-mediatype="image"></uni-file-picker>
								<button class="changePeople" v-if="item.invoiceStat == '1' && !item.receiveName" @click="openChangeModal(item)" type="primary">变更收货人</button>
								<button type="primary" v-if="item.invoiceStat == '1'" @click="openSignModal(item)">签收</button>
							</view>
						</view>
					</view>
				</u-card>
				<u-empty text="暂无相关内容" mode="list" v-if="tableList.length == 0"></u-empty>
				<view class="loadingWarp" v-if="showLoading">
					<u-loading size="70" color="#3498db"></u-loading>
				</view>
			</scroll-view>
			<u-modal v-model="confirmDialog" title="确认签收" :show-cancel-button="true" @confirm="confirmRecive()">
				<view class="modelContent">
					<u-radio-group v-model="haveMsg" :wrap="true" size="20px">
						<u-radio name="0" style="margin-bottom: 20px;"> 无异议</u-radio>
						<u-radio name="1" style="margin-bottom: 20px;"> 有异议</u-radio>
						<u-input v-if="haveMsg==1" v-model="confirmMsg" style="width: 220px;" type="textarea" :border="true"
							height="100" :auto-height="true" />
					</u-radio-group>
				</view>
			</u-modal>
			<u-modal v-model="changeDialog" title="变更收货人" :show-cancel-button="true" @confirm="goConfirmChange()">
				<view class="modelContent">
					<view class="form-item modal-item">
						<view class="title">姓名</view>
						<input class="input" name="input" v-model="reciver.name" placeholder="请输入..." />
					</view>
					<view class="form-item modal-item">
						<view class="title">手机号</view>
						<input class="input" name="input" v-model="reciver.phone" placeholder="请输入..." />
					</view>
				</view>
			</u-modal>
			<u-modal v-model="showModal" show-cancel-button cancel-text="取消" @confirm="goConfirm()" @cancel="showModal=false">
				<view class="tipsContent" >
					请仔细货单查看内容,<br>
					点击 <view class="boldFont">确认</view> 进入人脸识别确认订单.
				</view>
			</u-modal>
		</view>
		<img :src="nowItem.invoiceImage" alt="" v-show="false" style="width: 250px;position: absolute;z-index: -10;" ref="imageCon">
		<!-- <button @click="handleAddWaterMarker">添加水印</button>
		<img :src="image" alt="" style="width: 250px;opacity: 1;"> -->
		<u-top-tips ref="uTips"></u-top-tips>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				refreshTrigger: false,
				fileLists: [{
					url: '../../static/image/orderImg.png',
					// extname: 'png',
					// name: 'shuijiao.png'
				}],
				searchForm: {
					orderCode: "",
					custName: "",
					busiManName: "", //业务员
					makerName: "", //销售内勤
					invoiceStat: "1",
					offset: 0,
					limit: 10,
				},
				total: 0,
				showLoading: false,
				tableList: [],
				showModal: false,
				confirmDialog: false,
				haveMsg: 0,
				confirmMsg: '',
				confirmDialog: false, // 确认签收弹窗显示
				changeDialog: false, // 变更收货人
				reciver: {
					name: '',
					phone: ''
				},
				nowItem: {},
				image: '',
				imageUrl: ""
			}
		},
		watch: {},
		onLoad(options) {
			if(options.code) { // 人脸成功更改订单状态
				this.confirmSuccess(options);
			}
			this.getData();
		},
		methods: {
			// scroll-view到底部加载更多
			onreachBottom() {
				if (this.searchForm.limit >= this.total) {
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
				this.$request('/mallInvoice/query', 'POST', this.searchForm).then(res => {
					this.tableList = res.data.list
					this.total = res.data.total;
					this.refreshTrigger = false;
					this.showLoading = false;
				})
			},
			getMoreData() {
				this.$request('/mallInvoice/query', 'POST', this.searchForm).then(res => {
					this.tableList = res.data.list
					this.total = res.data.total;
				})
			},
			copy(info) {
				uni.setClipboardData({
					data: info,
					success: function() {
						console.log('复制成功');
					}
				});
			},
			// 变更收货人
			openChangeModal(item) {
				this.changeDialog = true;
				this.nowItem = item;
			},
			// 确认签收
			openSignModal(item) {
				this.nowItem = item;
				this.confirmDialog = true;
			},
			openConformModal() {
				this.showModal = true;
			},
			radioChange(key) {
				console.log(this.haveMsg)
				console.log()
			},
			// 图片添加水印
			handleAddWaterMarker (str,param) {
			    let content = str;
			    let imageCon = this.$refs.imageCon;//获取图片
			    let canvas = document.createElement("canvas");//创建canvas容器
			    canvas.width = imageCon.width;//设置canvas容器宽度
			    canvas.height = imageCon.height;//设置canvas容器高度
			
			    let ctx = canvas.getContext("2d");//获取2d画笔
			
			    //在canvas画布上绘制图片 ctx.drawImage(图片, x位置, y位置,  图像宽度, 图像高度);
			    ctx.drawImage(imageCon, 0, 0, imageCon.width, imageCon.height);
			
			     //设置文本画笔的样式
			    ctx.textAlign = 'left';//设置文本对齐方式
			    ctx.textBaseline = 'top';//设置文本基线
			    ctx.font = "15px Microsoft Yahei";//设置文本字体属性
			    ctx.fillStyle = "rgba(0, 0, 0, 1)"//设置文本字体颜色
			      
			    //在canvas画布上绘制文字 ctx.fillText(文字内容, x位置, y位置, 文本最大宽度)
			    ctx.fillText(content, imageCon.width - (content.split("").length * 14 + 10), imageCon.height - (14 + 10), imageCon.width)//14为文字大小
			      
				// blob 可以 转 file
			    canvas.toBlob((blob)=>{
					this.image = blob;
					console.log(blob,'blob')
					//  将blob 转为file   参数 blob, filename
					let fileOfBlob = new File([this.image], new Date().valueOf()+'.png');
					
					 uni.uploadFile({
					    url: '/api/file/upload',
					    file: fileOfBlob,
					    name: 'file',
					    success: (uploadFileRes) => {
					        console.log(uploadFileRes.data);
							// 更改当前item 的
							param.invoiceImage = 'https://suezp.cn/server/kmProfile.png';
							this.doneSave(param);
							// this.imageUrl = 'https://suezp.cn/server/kmProfile.png'
					    }
					});
				});
			},
			// 确认签收
			confirmRecive() {
				let param = {
					haveMsg: this.haveMsg,
					confirmMsg: this.confirmMsg
				}
				console.log('签收', param)
				this.goConfirm();
			},
			// 变更收货人
			goConfirmChange() {
				console.log(this.reciver)
				if(!this.reciver.name || !this.reciver.phone) {
					this.$refs.uTips.show({
						title: '请填写完整信息',
						type: 'warning',
						duration: '2000'
					})
					return
				}
				let param = {...this.nowItem};
				param.receiveName = this.reciver.name;
				param.receivePhone = this.reciver.phone;
				console.log(param);
				this.$request('/mallInvoice/save','POST', param).then(res=>{
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '收货人变更成功！',
						})
						this.getData();
					}
				})
			},
			goConfirm() {
				let nowUrl = window.location.href;
				this.$request('/face/getAuth','POST',{}).then(res=>{
					console.log(res,'回参')
					let token = JSON.parse(res.data).result.verify_token;
					let local = window.location.host;
					let successUrl = encodeURIComponent(`http://${local}/#/pages/confirmOrder/confirmOrder?code=${this.nowItem.invoiceCode}${this.haveMsg?('&msg='+this.confirmMsg):''}`);
					let faillUrl = encodeURIComponent(`http://${local}/#/pages/confirmOrder/confirmOrder`);
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
				this.$request('/mallInvoice/query', 'POST', query).then(res => {
					let param = res.data.list[0];
					param.invoiceStat = '1';
					// 多一步 处理有无异议 图片处理 修改水印图片地址
					if(options.msg) {
						 this.handleAddWaterMarker(options.msg,param);
						 return
					}
					console.log(param)
				    this.doneSave(param);
				})
			},
			// 更改订单信息
			doneSave(param) {
				this.$request('/mallInvoice/save','POST', param).then(res=>{
					console.log(res,'回参')
					if(res.code == 200) {
						uni.showToast({
							icon: 'success',
							title: '货物签收成功！',
						})
						this.getData();
						setTimeout(()=>{
							uni.navigateTo({
								url: '/pages/historyOrderList/historyOrderList?type=1'
							})
						},1500)
					} else {
						uni.showToast({
							icon: 'success',
							title: res.msg
						})
					}
				})
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
						right: 0;
						bottom: 0;
						font-size: 14px;
					}
				
					.changePeople {
						right: 70px;
						background-color: #ffa502;
					}
				}
			}
		}

		.ucard:nth-last-child(1) {
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
	.modelContent {
		padding: 20px;
	}
	
	.modal-item {
		border-bottom: 1rpx solid #e7e7e7;
		padding: 10px;
		display: flex;
		font-size: 14px;
	
		.title {
			font-size: 14px;
			width: 80px;
			color: #333;
		}
	
		.input {
			font-size: 14px;
			flex: 1;
		}
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
		background-color: rgba(255, 255, 255, 0.1);
		transition: all 0.5s ease-in-out;
	}
	/deep/ .u-radio__label {
		padding-left: 10px;
	}
</style>