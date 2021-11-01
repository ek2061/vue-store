import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS
import '@/styles/global.scss' // global css
import "@/conf/axios-config";
import "@/conf/vue-lodash-config";

import "@assets/commonStyle.css";
import "@assets/style.css";

// 這個路徑是我寫的mock
import mock from "@/mock";

Vue.use(iView);

Vue.config.productionTip = false

// 註冊全域變數
// Vue.prototype.$IMG_URL = "http://localhost:8080/EIAM/IMG/"
// Vue.prototype.$IMG_URL = "http://localhost:3001/"
// Vue.prototype.$IMG_URL = "http://172.19.35.23:8080/EIAM/IMG/"
Vue.prototype.$IMG_URL = "http://172.19.35.23:8080/EIAM/image/"

new Vue({
  router,
  store,
  iView,
  mock,
  render: h => h(App)
}).$mount('#app')
