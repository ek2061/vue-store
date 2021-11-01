<template>
  <div class="sendcoupon-container">
    <Navbar></Navbar>
    <br />
    <h3 style="font-size: 30px; text-align: center">發送優惠券</h3>
    <br />
    <div class="slider">
      <Slider v-model="discount" :step="50" :max="1000"></Slider>
      <h2>優惠券折價金額: {{discount}}</h2>
      <br />
      <br />
      <Input-number v-model="order_count" size="large"></Input-number>
      <h2>滿 {{order_count}} 張訂單</h2>
      <br />
      <Button type="primary" class="btn" @click="sendCoupon">發送優惠券</Button>
    </div>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";

import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      discount: 300,
      order_count: 1
    };
  },
  methods: {
    // 發送優惠券
    async sendCoupon() {
      const form = {
        amount: this.discount,
        orderCount: this.order_count
      };
      let res = await axios.post("/coupon/sendCoupon", form);
      if(res.data.body == "err") {
        this.$Message.error("發送優惠券發生錯誤")
      } else {
        this.$Message.success("發送優惠券成功")
      }
    },
    // 進這頁面前先檢查身分
    checkIdentity() {
      try {
        let token = localStorage.getItem("userToken");
        // 沒token是未登入者
        if (!token) {
          this.$Message.error("權限不符");
          this.$router.push("/403");
        }
        // 解開token並檢查是否為admin
        const decode = jwt_decode(token);
        if (decode.identity !== "admin" || decode.exp * 1000 < Date.now()) {
          this.$Message.error("權限不符或Token已過期");
          this.$store.dispatch("doLogout");
          this.$router.push("/login");
        }
      } catch (err) {
        this.$Message.error("發生錯誤，導回商店");
        this.$router.push("/store");
      }
    }
  },
  mounted() {
    this.checkIdentity();
  }
};
</script>

<style scoped>
.sendcoupon-container {
  background: #eee;
  height: 100%;
}
.slider {
  margin: 5em 20%;
  font-size: 15px;
}
.btn {
  margin-top: 1%;
  font-size: 20px;
  width: 100%;
  height: 40px;
}
</style>