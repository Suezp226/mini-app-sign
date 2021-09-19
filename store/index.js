
//  用户身份字段说明  userPosition 
//  0-管理员  1-业务员  2-销售内勤  3-客户  4-司机  5-收货人
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state:{//存放状态
        "userPosition": 0
    },
	mutations: {
		changePosition(state, num) {
			state.userPosition = num;
		}
	}
})

export default store