<template>
  <div class="store-container">
    <!-- 商品跑馬燈 -->
    <Row>
      <Col>
        <Navbar></Navbar>
      </Col>
      <Col>
        <Carousel autoplay v-model="nowCarousel" loop>
          <CarouselItem v-for="carousel, index in carouselList" :key="index">
            <br />
            <a href="https://www.esunbank.com.tw/bank/personal/credit-card">
              <img :src="carousel" alt="switch" style="width: 100%; height: 100%" />
            </a>
          </CarouselItem>
        </Carousel>
      </Col>
    </Row>

    <!-- 商品種類按鈕 -->
    <RadioGroup v-model="nowKind" type="button" size="large" @on-change="changeKind">
      <Radio v-for="item in productKind" :key="item.kindId" :label="item.kindId">{{ item.kindName }}</Radio>
    </RadioGroup>

    <!-- 商品卡片 -->
    <Row :gutter="15">
      <Col span="6" :xs="24" :sm="12" :lg="6" v-for="item in productList" :key="item.productId">
        <br />
        <Card style="width: 100%; height: 100%; position: relative">
          <p slot="title">{{ item.productName }}</p>
          <img
            :src="item.img"
            :alt="item.productName"
            style="width: 17vw; height: 17vw; margin: auto"
          />
          <p style="text-align: center">價格: $ {{ item.price }} 庫存: {{ item.inventory }}</p>
          <p class="seemore">
            <a>
              <u @click="goProductPage(item.productId)">詳細</u>
            </a>
          </p>
        </Card>
      </Col>
      <p v-if="productList == 0" class="noProduct">-- 當前商品類別沒有商品上架喔 --</p>
    </Row>
    <br />
    <Page
      :current="current_page"
      @on-change="pIndexChange"
      :total="total_page"
      :page-size="page_size"
      style="text-align: center"
      simple
    />

    <!-- <img
      :src="'http://172.19.35.23:8080/EIAM/PRIVATE/BlackStar?hash='+this.ImageHash"
      style="width:70px;height:70px"
      alt="沒權限看這張圖片"
    />-->
  </div>
</template>
<script>
import Navbar from "@/components/Navbar";

import axios from "axios";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      nowKind: "",
      nowCarousel: 0,
      productKind: [],
      productList: [],
      carouselList: [],
      page_size: 4,
      current_page: 1,
      total_page: 1,
      ImageHash: ""
    };
  },
  methods: {
    // 取得商品種類
    async getProductKind() {
      try {
        let res = await axios.post("/product/getKind");
        this.productKind = res.data.body;
        // 預設第1類
        this.nowKind = res.data.body[0].kindId;
      } catch (err) {
        this.$Message.error("請求商品種類失敗");
      }
    },
    // 透過商品種類取得商品
    async getProductList(kId, page_no) {
      const form = {
        id: kId,
        pageNo: page_no,
        pageSize: this.page_size,
        sortType: "ASC"
      };
      try {
        let res = await axios.post("/product/getProductByKind", form);
        this.productList = res.data.body.productList;
        for (let i = 0; i < this.productList.length; i++) {
          this.productList[i].img = this.$IMG_URL + this.productList[i].img;
        }
        this.current_page = res.data.body.pageNo;
        this.total_page = res.data.body.totalCount;
      } catch (err) {
        this.$Message.error("透過商品種類請求商品失敗");
      }
    },
    // 取得跑馬燈的圖片
    async getCarouselList() {
      try {
        let res = await axios.post("/carousel/img");
        const r = res.data.body;
        for (let i = 0; i < r.length; i++) {
          this.carouselList[i] = this.$IMG_URL + r[i].img;
        }
      } catch (err) {
        this.$Message.error("透過商品種類請求商品失敗");
      }
    },
    // 改變商品種類的事件
    changeKind() {
      // 預設拿第1頁的商品資料
      this.getProductList(this.nowKind, 1);
    },
    // 前往商品詳細頁面
    goProductPage(Pid) {
      this.$router.push(`/Product/${Pid}`);
    },
    // 底下分頁要跳到第幾頁
    pIndexChange(page_no) {
      this.getProductList(this.nowKind, page_no);
    },
    // 測試圖片權限
    getImageHash() {
      // 剛進網頁時拿token去後端驗證，成功就拿user的uuid和圖片的uuid去hash再傳回來
      // 以下省略直接使用hash=123
      if (localStorage.getItem("userToken")) this.ImageHash = "123";
    },
    tstMock() {
      // axios.post("/mock/getKind").then(res => console.log(res))
      // axios.post("/mock/productsByKind").then(res => console.log(res))
    }
  },
  mounted() {
    this.getCarouselList();
    this.getProductKind();
    this.getProductList(1, 1);
    this.getImageHash();
    this.tstMock();
  },
  watch: {}
};
</script>

<style scoped>
.store-container {
  background: #eee;
  padding: 30px 10%;
  height: 130%;
}
.seemore {
  color: blue;
  text-align: right;
}
.noProduct {
  font-size: 20px;
  text-align: center;
  margin: 50px;
}
</style>