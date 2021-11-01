<template>
  <div class="ordermanage-container">
    <Navbar></Navbar>
    <br />
    <h3 style="font-size: 30px; text-align: center">訂單管理</h3>
    <Table
      stripe
      border
      :columns="columns1"
      :data="tableData1"
      no-data-text="現在沒訂單等待出貨"
    ></Table>
    <br />
    <Page :current="current_page" @on-change="pIndexChange" :total="total_page" :page-size="page_size" style="text-align: center" simple />
    <br />
    <h3 style="font-size: 30px; text-align: center;">訂單細項</h3>
    <Table stripe border :columns="columns2" :data="tableData2" no-data-text="點擊訂單細項以查看訂單內容"></Table>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import axios from "axios";

import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      columns1: [
        {
          title: "下單時間",
          key: "paytime",
          sortable: true,
        },
        {
          title: "價格",
          key: "price"
        },
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
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                  },
                  on: {
                    click: () => {
                      this.getOrderDetail(params);
                    }
                  }
                },
                "訂單細項"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small",
                    disabled: parseInt(params.row.inventory) < parseInt(params.row.num),
                  },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.accept(params, "Y");
                    },
                  },
                },
                "出貨"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.accept(params, "N");
                    },
                  },
                },
                "駁回"
              ),
            ]);
          },
        },
      ],
      columns2: [
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
          title: "購買數量",
          key: "num",
        },
        {
          title: "庫存",
          key: "inventory",
        },
        {
          title: "單價",
          key: "price",
        },
      ],
      tableData1: [],
      tableData2: [],
      orderList: [],
      page_size: 5,
      current_page: 1,
      total_page: 1,
      imgURL: "",
    };
  },
  methods: {
    // 取得已付款的訂單
    async getOrder(page_no) {
      const form = {
        pageNo: page_no,
        pageSize: this.page_size,
        sortType: "ASC",
      };
      try {
        let res = await axios.post("/order/listOrder", form);
        this.orderList = res.data.body.orderList;
        this.tableData1 = this.orderList;
        this.current_page = res.data.body.pageNo
        this.total_page = res.data.body.totalCount
      } catch (err) {
        localStorage.removeItem("userToken")
        this.$store.dispatch("doLogout")
        this.$router.push("/login");
        this.$Message.error("取得訂單失敗");
      }
    },
    // 取得訂單細項
    async getOrderDetail(params) {
      if (localStorage.getItem("userToken")) {
        const form = {
          orderId: params.row.orderId
        };
        try {
          let res = await axios.post("/order/listOrderDetail", form);
          this.tableData2 = res.data.body;
        } catch (err) {
          this.$Message.error("取得訂單細項失敗");
          this.checkIdentity()
        }
      } else {
        // 未登入是看不到記錄的
        this.$router.push("/403");
      }
    },
    // 是否同意訂單出貨
    async accept(params, YN) {
      const form = {
        isAccept: YN,
        orderId: params.row.orderId,
      };
      let res = await axios.post("/order/accept", form);
      if (res.data.body === "err") {
        this.$Message.error("核准或拒絕訂單失敗");
      } else if (res.data.body === "Can't") {
        this.$Message.error("訂單內有商品購買數量超出庫存而無法出貨");
      } else {
        this.$Message.success("操作訂單成功");
        this.getOrder(this.current_page);
      }
    },
    // 底下分頁要跳到第幾頁
    pIndexChange(page_no) {
      this.getOrder(page_no)
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
    this.getOrder(1);
  },
};
</script>

<style scoped lang="scss">
.ordermanage-container {
  background: #eee;
  /* padding: 30px 10%; */
  height: 100%;
}
</style>