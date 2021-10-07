const goLogin = function() {
	uni.reLaunch({
		url: '/pages/login/login'
	})
}


const request = async function(url, method, data, header) {
	let token = '';
	token = uni.getStorageSync('token');
	
	if(!token && !['/msg/getMsgCode','/user/login'].includes(url)) {
		goLogin();
		setTimeout(()=>{
			uni.showToast({
				title: '请先登入!',
				icon: 'none',
				duration: 2000
			})
		},100)
		return Promise.reject({msg:'请先登入~'});
	}
	
	return new Promise((resolve, reject) => {
		uni.request({
			// TODO 处理请求地址
			url: '/api'+url, //仅为示例，并非真实接口地址。
			method: method.toUpperCase(),
			data: data,
			header: {
				'Authorization': token, //自定义请求头信息
				'Content-Type': header ? header['Content-Type'] : 'application/json'
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				reject(err);
			}
		});
	})
}


export default request
