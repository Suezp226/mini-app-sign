<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	page {
		height: 100%;
		width:100%;
		box-sizing: border-box;
		overflow-x: hidden;
		overflow-y: auto;
		/* background-color: #e4e9fc; */
	}
	.uni-file-picker__header  .file-title{
		font-size: 14px!important;
		margin-right: 55px!important;
	}
	.u-card__head {
		padding: 10px!important;
	}
	@import "uview-ui/index.scss";
	.tipsContent {
		padding: 20px 30px;
		font-size: 14px;
	}
	
	// modal 样式
	.boldFont {
		font-weight: 600;
		display: inline-block;
		padding: 0 5px;
	}
	.tipsContent {
		padding: 20px 30px;
		font-size: 14px;
	}
	// 页面加载
	.loadCover {
		position: absolute;
		z-index: 10;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		transition: all 0.5s ease-in-out;
	}
	.file-box {
		height: 70px;
		width: 70px;
		margin: 5px;
		display: inline-block;
		// border: 1px solid rgb(182, 178, 178);
	}
	/deep/ .u-card__body {
		padding: 15px 15px 35px 15px!important;
	}
	.phoneCall {
		color: blue;
		text-decoration: underline;
	}
	// 滚顶底部增高
	.bottom-block {
		height: 40px;
		opacity: 0;
		width: 100%;
	}
</style>
