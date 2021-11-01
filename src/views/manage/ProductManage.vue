<template>
  <div class="productmanage-container">
    <Navbar></Navbar>
    <br />
    <h3 style="font-size: 30px; text-align: center">商品管理</h3>
    <Table
      stripe
      border
      :columns="columns1"
      :data="data1"
      no-data-text="現在沒商品可以管理"
    ></Table>
    <br />
    <Page :current="current_page" @on-change="pIndexChange" :total="total_page" :page-size="page_size" style="text-align: center" simple />    
    <Button type="primary" class="btn" @click="create">新增商品</Button>
    <Modal v-model="modal1" title="確定要刪除嗎" @on-ok="del(params)">
      <p>此行為無法復原</p>
    </Modal>
    <Dialog
      :dialog="dialog"
      :formData="formData"
      :imgURL="imgURL"
      @update="getProductList(1)"
    ></Dialog>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import axios from "axios";

import Navbar from "@/components/Navbar";
import Dialog from "@/components/Dialog";

export default {
  components: {
    Navbar,
    Dialog,
  },
  data() {
    return {
      columns1: [
        {
          title: "商品圖片",
          key: "img",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: this.$IMG_URL + params.row.img,
                },
                style: {
                  width: "50px",
                  height: "50px",
                },
              }),
            ]);
          },
        },
        {
          title: "商品名稱",
          key: "productName",
        },
        {
          title: "商品種類",
          key: "kindName",
        },
        {
          title: "庫存",
          key: "inventory",
        },
        {
          title: "單價",
          key: "price",
        },
        { title: "是否上架", key: "onsell" },
        { title: "商品描述", key: "depiction" },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.edit(params);
                    },
                  },
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.modal1 = true;
                      this.params = params;
                    },
                  },
                },
                "刪除"
              ),
            ]);
          },
        },
      ],
      data1: [],
      formData: {
        depiction: "",
        inventory: "",
        onsell: "",
        price: "",
        id: "",
        productKind: "",
        productName: "",
      },
      productKindList: [],
      productList: [],
      modal1: false,
      params: [],
      dialog: {
        show: false,
        title: "修改商品",
        option: "put",
      },
      page_size: 5,
      current_page: 1,
      total_page: 1,
      imgURL: "",
    };
  },
  methods: {
    // 取得商品種類
    async getProductKind() {
      try {
        let res = await axios.post("/product/getKind");
        this.productKindList = res.data.body;
      } catch (err) {
        this.$Message.error("請求商品種類失敗");
      }
    },
    // 取得所有商品資訊
    async getProductList(page_no) {
      const form = {
        id: -1,
        pageNo: page_no,
        pageSize: this.page_size,
        sortType: "ASC",
      };
      try {
        let res = await axios.post("/product/getAll", form);
        this.productList = res.data.body.allProductList;
        this.data1 = this.productList;
        this.current_page = res.data.body.pageNo
        this.total_page = res.data.body.totalCount
      } catch (err) {
        localStorage.removeItem("userToken")
        this.$store.dispatch("doLogout")
        this.$router.push("/login");
        this.$Message.error("請求商品失敗");
      }
    },
    // 按下新增商品的按鈕事件
    create() {
      (this.dialog = {
        title: "新增商品",
        show: true,
        option: "add",
      }),
        (this.formData = {
          productId: "",
          depiction: "",
          inventory: "",
          onsell: "",
          price: "",
          productKind: "",
          productName: "",
        });
        this.imgURL = "../noIMG.jpg"
    },
    // 按下修該商品的按鈕事件
    edit(params) {
      this.dialog = {
        title: "修改商品",
        show: true,
        option: "put",
      };
      this.formData = {
        id: params.row.productId,
        depiction: params.row.depiction,
        inventory: params.row.inventory,
        onsell: params.row.onsell,
        price: params.row.price,
        productKind: params.row.productKind,
        productName: params.row.productName,
      };
      this.imgURL = this.$IMG_URL + params.row.img;
    },
    // 按下刪除商品的按鈕事件
    async del(params) {
      // 程式是對的只是不小心按到會很危險
      const form = {
        id: params.row.productId,
      };
      try {
        let res = await axios.post("/product/del", form);
        if (res.data.body == "403") {
          this.$Message.error("權限不符");
          this.$router.push("/403");
        } else if(res.data.body !== "ok") {
          this.$Message.error("無法刪除或不該被刪除");
        }
        else {
          this.$Message.success("刪除成功");
        }
        this.getProductList(1)
      } catch (err) {
        this.$Message.error("刪除商品失敗");
        this.checkIdentity()
      }
    },
    // 底下分頁要跳到第幾頁
    pIndexChange(page_no) {
      this.getProductList(page_no)
    },
    // 進這頁面前先檢查身分
    checkIdentity() {
      try{
        let token = localStorage.getItem("userToken")
        // 沒token是未登入者
        if(!token) {
          this.$Message.error("權限不符");
          this.$router.push("/403");
        }
        // 解開token並檢查是否為admin
        const decode = jwt_decode(token)
        if(decode.identity !== "admin" || decode.exp*1000 < Date.now()) {
          this.$Message.error("權限不符或Token已過期");
          this.$store.dispatch("doLogout");
          this.$router.push("/login");
        } 
      } catch(err) {
        this.$Message.error("發生錯誤，導回商店");
        this.$router.push("/store");
      }
    }
  },
  mounted() {
    this.checkIdentity();
    this.getProductList(1);
  },
};
</script>

<style scoped>
.productmanage-container {
  background: #eee;
  /* padding: 30px 10%; */
  height: 100%;
}
.btn {
  margin-top: 1%;
  
  width: 100%;
  height: 35px;
}
</style>