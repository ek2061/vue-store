<template>
  <div class="managehome-container">
    <h1 style="font-size: 40px">管理員頁面</h1>
    <div>
      <li class="list">
        <router-link to="/manage/productManage">商品管理</router-link>
      </li>
      <li class="list">
        <router-link to="/manage/orderManage">訂單管理</router-link>
      </li>
      <li class="list">
        <router-link to="/manage/sendcoupon">發送優惠券</router-link>
      </li>
      <li class="list">
        <router-link to="/manage/carouselManage">廣告跑馬燈管理</router-link>
      </li>
      <li class="list">
        <router-link to="/store">返回商店</router-link>
      </li>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
  }
};
</script>


<style scoped>
.managehome-container {
  background: #eee;
  /* padding: 30px 10%; */
  height: 100%;
  text-align: center;
}
.list {
  font-size: 20px;
  text-decoration: underline;
}
.list:hover {
  color: red;
}
</style>