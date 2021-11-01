<template>
  <div class="orderhistory-container">
    <Navbar></Navbar>
    <br />
    <h3 style="font-size: 30px; text-align: center;">訂單記錄</h3>
    <br />
    <Table stripe border :columns="columns1" :data="tableData1" no-data-text="現在沒訂單記錄"></Table>
    <br />
    <Page
      :current="current_page"
      @on-change="pIndexChange"
      :total="total_page"
      :page-size="page_size"
      style="text-align: center"
      simple
    />
    <br />
    <h3 style="font-size: 30px; text-align: center;">訂單細項</h3>
    <Table stripe border :columns="columns2" :data="tableData2" no-data-text="點擊訂單細項以查看訂單內容"></Table>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode"
import axios from "axios";

import Navbar from "@/components/Navbar";

export default {
  components: {
    Navbar
  },
  data() {
    return {
      columns1: [
        {
          title: "下單時間",
          key: "paytime",
          sortable: true
        },
        {
          title: "處理時間",
          key: "shiptime",
          sortable: true
        },
        {
          title: "取貨時間",
          key: "pickuptime",
          sortable: true
        },
        {
          title: "狀態",
          key: "state"
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
                    type: "primary",
                    size: "small",
                    disabled: params.row.pickuptime !== null
                  },
                  style: {
                    marginRight: "5px",
                    display:
                      params.row.shiptime == null ||
                      params.row.state == "交易被取消"
                        ? "none"
                        : "inline-block"
                  },
                  on: {
                    click: () => {
                      this.pickupOrder(params);
                    }
                  }
                },
                "完成取貨"
              ),
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
              )
            ]);
          }
        }
      ],
      columns2: [
        {
          title: "商品圖片",
          key: "img",
          render: (h, params) => {
            return h("div", [
              h("img", {
                attrs: {
                  src: this.$IMG_URL + params.row.img
                },
                style: {
                  width: "50px",
                  height: "50px"
                }
              })
            ]);
          }
        },
        {
          title: "商品名稱",
          key: "productName"
        },
        {
          title: "購買數量",
          key: "num"
        },
        {
          title: "單價",
          key: "price"
        }
      ],
      tableData1: [],
      tableData2: [],
      page_size: 10,
      current_page: 1,
      total_page: 1,
    };
  },
  methods: {
    // 獲取訂單
    async getOrderHistory(page_no) {
      if (localStorage.getItem("userToken")) {
        const form = {
          pageNo: page_no,
          pageSize: this.page_size,
          sortType: "ASC"
        };
        try {
          let res = await axios.post("/order/listOrder", form);
          this.tableData1 = res.data.body.orderList;
          this.current_page = res.data.body.pageNo;
          this.total_page = res.data.body.totalCount;
          for (let i = 0; i < this.tableData1.length; i++) {
            if (this.tableData1[i].paytime == null) {
              // 下單時間為空
              this.tableData1[i].state = "未付款";
            } else if (this.tableData1[i].shiptime == null) {
              // 出貨時間為空
              this.tableData1[i].state = "訂單處理中";
            } else if (this.tableData1[i].shipped == "N") {
              // 有出貨時間但不被出貨
              this.tableData1[i].state = "交易被取消";
            } else if (this.tableData1[i].pickuptime == null) {
              // 收貨時間為空
              this.tableData1[i].state = "等待取貨";
            } else {
              this.tableData1[i].state = "訂單完成";
            }
          }
        } catch (err) {
          this.$Message.error("取得歷史訂單失敗");
          this.checkIdentity()
        }
      } else {
        // 未登入是看不到記錄的
        this.$router.push("/403");
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
    // 訂單取貨
    async pickupOrder(params) {
      const form = {
        orderId: params.row.orderId
      };

      try {
        let res = await axios.post("/order/pickup", form);
        if (res.data.body === "ok") {
          this.$Message.success("取貨成功");
        }
      } catch (err) {
        this.$Message.error("取貨失敗");
        this.checkIdentity()
      }
      this.getOrderHistory(this.current_page);
    },
    // 底下分頁要跳到第幾頁
    pIndexChange(page_no) {
      this.getOrderHistory(page_no);
    },
    // 進這頁面前先檢查身分
    checkIdentity() {
      if (!localStorage.getItem("userToken")) {
        this.$Message.error("權限不符，導回商店");
        this.$router.push("/store");
      } else {
        const decode = jwt_decode(localStorage.getItem("userToken"));
        if (decode.exp*1000 < Date.now()) {
          this.$Message.error("Token已過期");
          this.$store.dispatch("doLogout");
          this.$router.push("/login");
        }
      }
    },
    // 改變要查的模式的事件
    changeModel() {
      // 預設拿第1種
      this.getOrderHistory(1);
    }
  },
  mounted() {
    this.checkIdentity();
    this.getOrderHistory(1);
  }
};
</script>

<style scoped lang="scss">
.orderhistory-container {
  background: #eee;
  padding: 30px 10%;
  height: 100%;
}
</style>