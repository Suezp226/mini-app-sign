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
</style>
