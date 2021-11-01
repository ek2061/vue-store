<template>
  <div class="checkout-container">
    <Navbar></Navbar>
    <Form ref="checkoutForm" :model="checkoutForm" class="checkout-form" :rules="checkoutRules">
      <div class="title-container">
        <h3 class="title">付款資訊</h3>
      </div>
      <Form-item prop="name">
        <Input v-model="checkoutForm.name" placeholder="請輸入收件人姓名">
          <Icon type="ios-person-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>

      <Select v-model="couponIndex" placeholder="選擇優惠券" @on-change="changeCoupon">
        <Option
            v-for="(coupon, index) in couponList"
            :value="index"
            :key="coupon.couponId"
          >{{ coupon.discount }}  元</Option>
      </Select>

      <p class="txt">商品總價: ${{productPrice}}</p>
      <p class="txt">使用優惠券: - ${{discount}}</p>
      <p class="txt">配送費(消費低於200收100): ${{shippingFee}}</p>
      <p class="txt">總金額: ${{finalPrice}}</p>
      <Button type="primary" to="/cart" class="btn">上一步</Button>
      <Button type="primary" @click="handleCheckout" class="btn">成立訂單</Button>
    </Form>
    <Modal v-model="modal1" title="謝謝惠顧" @on-ok="ok">
      <p>感謝您的購買</p>
      <p>我們會盡快審核您的訂單</p>
      <p>點擊確定返回商店頁面</p>
    </Modal>
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
    const validateName = (rule, value, callback) => {
      if (value.replace(/^\s+|\s+$/g, "") === "") {
        callback(new Error("姓名不能為空"));
      } else {
        callback();
      }
    };
    return {
      modal1: false,
      checkoutForm: {
        name: this.$store.state.name
      },
      checkoutRules: {
        name: [{ trigger: "blur", validator: validateName }]
      },
      productPrice: 0,
      shippingFee: 0,
      couponList: [],
      couponIndex: 0,
      discount: 0,  // 優惠券金額
      finalPrice: 0, // 最終價格
    };
  },
  methods: {
    // 獲取優惠券
    async getCoupon() {
      let res = await axios.post("/coupon/listCoupon")
      this.couponList = res.data.body
      this.couponList.unshift({couponId: null, discount: "0"})
    },
    changeCoupon(){
      this.discount = this.couponList[this.couponIndex].discount
      this.calcOrder()
    },
    // 前往結帳的按鈕事件
    handleCheckout() {
      this.$refs.checkoutForm.validate(async valid => {
        const form = {
          lsOrderId: this.$store.state.selectOrderId,
          couponId: this.couponList[this.couponIndex].couponId
        };
        if (valid) {
          try {
            let res = await axios.post("/order/buy", form);
            // 如果購買成功
            if (res.data.body === "ok") {
              this.modal1 = true;
            } else {
              this.$Message.error("付款失敗");
            }
          } catch (err) {
            this.$Message.error("提交訂單失敗");
            this.checkIdentity();
          }
        }
      });
    },
    // 計算訂單價格避免沒更新到
    async calcOrder() {
      const form = {
        lsOrderId: this.$store.state.selectOrderId
      };
      try {
        let res = await axios.post("/order/calcCart", form);
        if (res.data.body == "err") {
          this.$Message.error("計算訂單價格發生錯誤");
          this.productPrice = "ERROR";
        } else {
          this.productPrice = res.data.body;
          // 運費計算
          if (this.productPrice - this.discount < 200) {
            this.shippingFee = 100;
          } else {
            this.shippingFee = 0;
          }

          this.finalPrice = (this.productPrice-this.discount > 0)?this.productPrice-this.discount+this.shippingFee:this.shippingFee
        }
      } catch (err) {
        this.$Message.error("計算訂單價格失敗");
        this.checkIdentity();
      }
    },
    // 結帳完按下ok的按鈕事件
    ok() {
      this.$router.push("/store");
    },
    // 進這頁面前先檢查身分
    checkIdentity() {
      if (!localStorage.getItem("userToken")) {
        this.$Message.error("權限不符，導回商店");
        this.$router.push("/store");
      } else {
        const decode = jwt_decode(localStorage.getItem("userToken"));
        if (decode.exp * 1000 < Date.now()) {
          this.$Message.error("Token已過期");
          this.$store.dispatch("doLogout");
          this.$router.push("/login");
        }
      }
    }
  },
  created() {
    this.getCoupon();
    this.checkIdentity();
    this.calcOrder();
  }
};
</script>

<style lang="scss" scoped>
.checkout-container {
  background: #eee;
  padding: 30px 10%;
  height: auto;
}
.title-container {
  position: relative;
  .title {
    font-size: 26px;
    // color: #eee;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
}
.btn {
  margin-top: 1%;
  width: 50%;
  height: 35px;
}
.txt {
  font-size: 18px;
}
</style>