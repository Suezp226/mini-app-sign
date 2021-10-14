export default {
	// 校验图片
	isImageFn:function(str) {
		var reg = /\.(png|jpg|gif|jpeg|webp)$/;
		return reg.test(str);
	},
	// 校验p
	isFileFn: function(str) {
		var reg1 = /\.(pdf)$/;
		var reg2 = /\.(xls|xlsx|csv)$/;
		let type = 'file';
		if (reg1.test(str)) {
			type = 'pdf'
		} else if (reg2.test(str)) {
			type = 'excel'
		}
		return type;
	}
}
