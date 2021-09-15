<template>
	<view>
		人脸识别
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msg: '没错就是我'
			}
		},
		onLoad(options) {
			console.log('接受传参',options)
		},
		methods:{
			sayHi() {
				console.log('sayHi!',this.msg)
			}
		},
	}
</script>

<style>
</style>
