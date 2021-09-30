
//  用户身份字段说明  userPosition 
//  gly-管理员  ywy-业务员  xsnq-销售内勤  kh-客户  sj-司机  shr-收货人
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{//存放状态
        "userPosition": 'ywy'
    },
	mutations: {
		changePosition(state, str) {
			state.userPosition = str;
		}
	}
})

export default store