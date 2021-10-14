import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui';
import {createSSRApp} from 'vue'
import Vuex from 'vuex'
import store from './store'
import apiService from 'static/js/apiService.js'
import judgeFile from 'static/js/judgeFiletype.js'

Vue.use(Vuex)
Vue.use(uView);

Vue.config.productionTip = false
Vue.prototype.$store = store
Vue.prototype.$request = apiService
Vue.prototype.$imgBaseUrl = 'http://suezp.cn:1118'
Vue.prototype.$judgeFiletype = judgeFile


if(uni.getStorageSync('userInfo')){
	let info = JSON.parse(uni.getStorageSync('userInfo'));
	store.commit('putUserInfo',info);
	store.commit('changePosition', info.roleCode);
	console.log('初始化获取本地信息给store')
}

App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})

app.$mount();
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  return {
    app
  }
}
// #endif