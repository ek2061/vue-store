<template>
  <div class="product-container">
    <Navbar ref="navbar"></Navbar>
    <br />
    <div>
      <img
        :src="this.productImg"
        :alt="productInfo.productName"
        class="product-img"
      />
    </div>
    <div class="product-des">
      <p>名稱: {{ this.productInfo.productName || "未取得" }}</p>
      <p>價格: ${{ this.productInfo.price || "未取得" }}</p>
      <p>庫存: {{ this.productInfo.inventory || "未取得" }}</p>
      <p>商品敘述: {{ this.productInfo.depiction || "未取得" }}</p>
      <br />
      <p>購買數量</p>
    </div>
    <Input
      v-model="buyCount"
      type="number"
      autosize
      style="height: 34px; width: 100px"
    ></Input>
    <div>
      <br />
      <Button type="primary" @click="AddOrder">加入購物車</Button>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";

import axios from "axios";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      productInfo: {},
      productImg: "/noIMG.jpg",
      buyCount: 1, // 購買數量預設1
      nowCart: this.$store.state.cart,
    };
  },
  methods: {
    // 向後端取得商品資訊
    async getProductInfo() {
      const form = {
        id: this.$route.params.id,

        // 因為和取得多數商品資料共用reqModelBean所以必填，除非新增一個reqModelBean
        pageNo: 1,
        pageSize: 1,
        sortType: "ASC",
      };
      try {
        let res = await axios.post("/product/getProductById", form);
        // 因為是回傳陣列所以會在第0筆
        this.productInfo = res.data.body[0];
        this.productImg = this.$IMG_URL + this.productInfo.img;
      } catch (err) {
        this.$Message.error("取得商品內容失敗");
      }
    },
    // 加入訂單到購物車的按鈕事件
    async AddOrder() {
      if (localStorage.getItem("userToken")) {
        // 有token就是有登入，有登入就傳到資料庫確保同步
        const form = {
          num: this.buyCount,
          productId: this.productInfo.productId,
        };
        try {
          let res = await axios.post("/order/add", form);
          if (res.data.body === "ok") this.$Message.success("添加訂單成功");
        } catch (err) {
          this.$Message.error("添加訂單失敗");
        }
      } else {
        // 沒登入只存session
        let isExist = false; // 當前商品是否存在購物車session
        for (let i = 0; i < this.nowCart.length; i++) {
          // 如果這個商品已經存在購物車session，就直接加購買數量
          if (this.nowCart[i].productId == this.productInfo.productId) {
            this.nowCart[i].num += this.buyCount;
            isExist = true;
            break;
          }
        }

        // 如果剛剛檢查完還是不存在購物車session就加入新資料
        if (!isExist) {
          this.nowCart.push({
            productId: this.productInfo.productId,
            img: this.productInfo.img,
            productName: this.productInfo.productName,
            num: this.buyCount,
            price: this.productInfo.price,
          });
        }
        this.$store.dispatch("doUpdateCart", this.nowCart);
        this.$Message.success("添加訂單成功");
      }
    },
  },
  mounted() {
    // 剛載入時以商品id去取得商品資訊
    this.getProductInfo(this.$route.params.id);
  },
};
</script>

<style scoped lang="scss">
.product-container {
  background: #eee;
  padding: 30px 10%;
  height: 100%;
}
.product-img {
  float: left;
  width: 480px;
  height: 480px;
  margin: 5px 20px 0px 20px;
}
.product-des {
  width: auto;
  p {
    float: top;
    font-size: 22px;
    margin-left: 20px;
  }
}

@media screen and (max-width: 490px) {
  .product-img {
    // float: left;
    width: 100%;
    height: 100%;
    margin: 5px 20px 0px 20px;
  }
}
</style>