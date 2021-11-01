<template>
  <div class="carouselmanage-container">
    <Navbar></Navbar>
    <br />
    <h3 style="font-size: 30px; text-align: center">廣告跑馬燈管理</h3>
    <br />

    <div style="text-align: center;">
      <div>
        <label style="font-size: 20px;">跑馬燈選擇</label>
        <Select
          v-model="model1"
          style="width:200px"
          placeholder="請選擇"
          not-found-text="找不到資料"
          @on-change="changeCarousel"
        >
          <Option
            v-for="carousel in carouselList"
            :value="carousel.carouselId"
            :key="carousel.carouselId"
          >{{ carousel.carouselId }}</Option>
        </Select>
      </div>
      <br />
      <img :src="nowImg" style="width: 100%; height: auto; padding: 3%;" />
      <div>
        <Upload
          ref="upload"
          :headers="{'token': token}"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :before-upload="handleBeforeUpload"
          :format="['jpg', 'jpeg', 'png']"
          :max-size="2048"
          :on-format-error="handleFormatError"
          :on-exceeded-size="handleMaxSize"
          :data="uploadData"
          type="drag"
          action="http://localhost:8080/EIAM/uploadImage/carousel"
          style="display: inline-block; width: 100%;"
        >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>點擊或拖曳影像上傳</p>
          </div>
        </Upload>
      </div>
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
      carouselList: [
        {
          carouselId: 1,
          img: 1
        }
      ],
      model1: "1",
      nowImg: "../noIMG.jpg",
      token: localStorage.getItem("userToken"),
      uploadData: {
        carouselId: 0
      }
    };
  },
  methods: {
    // 上傳前要做的事
    handleBeforeUpload() {
      this.uploadData.carouselId = this.model1;
    },
    // 獲取跑馬燈資料
    async getCarouselList() {
      try {
        let res = await axios.post("/carousel/img");
        this.carouselList = res.data.body;
        for (let i = 0; i < this.carouselList.length; i++) {
          this.carouselList[i].img = this.$IMG_URL + this.carouselList[i].img;
        }
        this.nowImg = this.carouselList[this.model1 - 1].img;
      } catch (err) {
        this.$Message.error("透過商品種類請求商品失敗");
        this.checkIdentity()
      }
    },
    // 影像上傳成功的事件
    handleSuccess(res, file) {
      if (res.body == "err") {
        this.$Message.error("圖片上傳失敗");
      } else {
        this.$Message.success("圖片上傳成功");
        file.url = "http://localhost:8080/EIAM/" + res.body;
        this.getCarouselList();
      }
    },
    // 影像格式錯誤的事件
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式不正確",
        desc:
          "文件 " + file.name + " 格式不正確，請上傳 jpg 或 png 格式的圖片。"
      });
    },
    // 影像超過最大限制的事件
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超出文件大小限制",
        desc: "文件 " + file.name + " 太大，不能超過 2M。"
      });
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
        if (decode.identity !== "admin" || decode.exp*1000 < Date.now()) {
          this.$Message.error("權限不符或Token已過期");
          this.$store.dispatch("doLogout");
          this.$router.push("/login");
        }
      } catch (err) {
        this.$Message.error("發生錯誤，導回商店");
        this.$router.push("/store");
      }
    },
    // 改變要看第幾張跑馬燈的事件
    changeCarousel() {
      this.nowImg = this.carouselList[this.model1 - 1].img;
    }
  },
  mounted() {
    this.checkIdentity();
    this.getCarouselList();
  }
};
</script>

<style scoped>
.carouselmanage {
  background: #eee;
  /* padding: 30px 10%; */
  height: 100%;
  text-align: center;
}

.demo-upload-list {
  padding: 20px 0;
  /* display: inline-block; */
  width: auto;
  height: auto;
  text-align: center;
  /* line-height: auto; */
  border: 1px solid transparent;
  border-radius: 4px;
  /* overflow: hidden; */
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 80em;
  height: auto;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 10% 2px;
}
</style>
