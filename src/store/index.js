import Vue from 'vue'
import Vuex from 'vuex'
import Types from "./mutation-types";
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    name: "guest",      // 目前登入的名字
    identity: "guest",  // 目前登入的身分
    cart: [],           // 目前購物車內的訂單(給未登入的用)
    selectOrderId: [],  // 選中要付錢的訂單
    axios: {
      requestCount: 0,
    },
  },
  getters: {
    getProductIdFromCart: state => {
      return state.cart.map(item => Object.values(item)[0])
    }
  },
  mutations: {
    // 設定登入者名字
    [Types.NAME](state, payload) {
      state.name = payload;
    },
    // 設定登入者身分
    [Types.IDENTITY](state, payload) {
      state.identity = payload;
    },
    // 設定購物車內容物
    [Types.CART](state, payload) {
      state.cart = payload;
    },
    // 設定要付錢的訂單
    [Types.SELECTORDERID](state, payload) {
      state.selectOrderId = payload;
    },
    // 設定登出清除全部
    [Types.LOGOUT](state) {
      state.name = "guest",
        state.identity = "guest",
        state.cart = [],
        state.selectOrderId = []
      axios.post("/user/logout")
        .then(() => console.log("登出成功"))
        .catch(err => console.log("登出發生問題:" + err))
    },

    /**
     * AJAX Request執行中次數加1
     * @param {*} state
     */
    [Types.INCREMENT_AJAX_REQ](state) {
      state.axios.requestCount++;
    },
    /**
     * AJAX Request執行中次數減1
     * @param {*} state
     */
    [Types.DECREMENT_AJAX_REQ](state) {
      state.axios.requestCount--;
    },
  },
  actions: {
    // 更新登入者名字
    doUpdateName({ commit }, payload) {
      commit(Types.NAME, payload);
    },
    // 更新登入者身分
    doUpdateIdentity({ commit }, payload) {
      commit(Types.IDENTITY, payload);
    },
    // 更新購物車內容物
    doUpdateCart({ commit }, payload) {
      commit(Types.CART, payload);
    },
    // 更新要算錢的清單
    doUpdateSelectOrderId({ commit }, payload) {
      commit(Types.SELECTORDERID, payload);
    },
    // 登出
    doLogout({ commit }) {
      commit(Types.LOGOUT)
    },

    /**
     * AJAX Request執行中次數加1
     * @param {*} commit
     */
    doIncrementAjaxReq({ commit }) {
      commit(Types.INCREMENT_AJAX_REQ);
    },
    /**
     * AJAX Request執行中次數減1
     * @param {*} commit
     */
    doDecrementAjaxReq({ commit }) {
      commit(Types.DECREMENT_AJAX_REQ);
    },
  },
})
