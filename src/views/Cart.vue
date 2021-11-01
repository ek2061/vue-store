<template>
  <div class="cart-container">
    <Row>
      <Col>
        <Navbar @update="getOrder" ref="navbar"></Navbar>
      </Col>
    </Row>
    <br />
    <p style="font-size: 30px; text-align: center">購物車</p>
    <Table
      stripe
      border
      :columns="columns1"
      :data="tableData"
      @on-selection-change="handleSelect"
      ref="selection"
      no-data-text="你的訂單是空的，趕快去逛逛吧！"
    ></Table>
    <br />
    <Page
      :current="current_page"
      @on-change="pIndexChange"
      :total="total_page"
      style="text-align: center"
      simple
    />
    <Button
      type="primary"
      style="margin-top: 1%; width: 100%; height: 35px"
      @click="handleCheckout"
      >去結算</Button
    >
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import Navbar from "@/components/Navbar";

import axios from "axios";

export default {
  components: {
    Navbar,
  },
  data() {
    return {
      columns1: [
        {
          type: "selection",
          width: 50,
          align: "center",
        },
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
          title: "單價",
          key: "price",
        },
        {
          title: "操作",
          key: "action",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Input", {
                props: { type: "number", value: params.row.num },
                style: {
                  min_height: "40px",
                  width: "60px",
                  marginRight: "5px",
                },
                on: {
                  "on-change": (event) => {
                    params.row.num = event.target.value;
                  },
                },
              }),
              h(
                "Button",
                {
                  props: { type: "primary", size: "small" },
                  style: { marginRight: "5px" },
                  on: {
                    click: () => {
                      this.editOrder(params);
                    },
                  },
                },
                "送出修改"
              ),
              h(
                "Button",
                {
                  props: { type: "error", size: "small" },
                  on: {
                    click: () => {
                      this.deleteOrder(params);
                    },
                  },
                },
                "移除商品"
              ),
            ]);
          },
        },
      ],
      tableData: [],
      page_size: 10,
      current_page: 1,
      total_page: 1,
      nowCart: this.$store.state.cart,
      nowIdentity: this.$store.state.identity,
      userId: this.$store.state.userId,
      selectOrderId: [],
    };
  },
  methods: {
    // 取得購物車訂單內容
    async getOrder(page_no) {
      if (localStorage.getItem("userToken")) {
        // 有token就是有登入，向資料庫取得訂單
        this.checkExpirationTime()
        const form = {
          pageNo: page_no,
          pageSize: this.page_size,
          sortType: "ASC",
        };
        try {
          let res = await axios.post("/order/listCart", form);
          this.tableData = res.data.body.listCart;
          this.current_page = res.data.body.pageNo;
          this.total_page = res.data.body.totalCount;
        } catch (err) {
          this.$Message.error("取得訂單失敗");
        }
      } else {
        // 沒登入的情況先去要求這幾個商品的名字、單價和圖片確保資料沒被改過
        const form = {
          lsProductId: this.$store.getters.getProductIdFromCart
        }
        let res = await axios.post("/order/alignCart", form);

        this.$store.state.cart.forEach((item, index) => {
          item.img = res.data.body[index].img
          item.price = res.data.body[index].price
          item.productName = res.data.body[index].productName
        })
        this.tableData = this.$store.state.cart;
      }
    },
    // 修改訂單資料
    async editOrder(params) {
      if (localStorage.getItem("userToken")) {
        // 有token就是有登入，修改資料庫訂單
        try {
          const form = {
            num: params.row.num,
            orderId: params.row.orderDetailId,
          };
          let res = await axios.post("/order/put", form);
          if (res.data.body !== "ok") {
            this.$Message.error("修改發生錯誤");
          } else {
            this.getOrder(this.current_page)
            this.$Message.success("修改成功");
          }
        } catch (err) {
          this.$Message.error("修改訂單失敗");
        }
      } else {
        // 沒登入的情況直接修改session
        (this.nowCart[params.row._index].num = params.row.num),
          (this.tableData = this.nowCart);
        this.$store.dispatch("doUpdateCart", this.nowCart);
      }
    },
    // 刪除訂單資料
    async deleteOrder(params) {
      if (localStorage.getItem("userToken")) {
        // 有token就是有登入，刪除資料庫訂單
        try {
          const form = {
            orderId: params.row.orderDetailId,
          };
          let res = await axios.post("/order/del", form);
          if (res.data.body !== "ok") {
            this.$Message.error("刪除發生錯誤");
          } else {
            this.getOrder(this.current_page)
            this.$Message.success("刪除成功");
          }
        } catch (err) {
          this.$Message.error("刪除訂單失敗");
        }
      } else {
        // 沒登入的情況直接修改session
        this.nowCart.splice(params.row._index, 1);
        this.tableData = this.nowCart;
        this.$store.dispatch("doUpdateCart", this.nowCart);
      }
    },
    // 多選框選中事件
    handleSelect(){
      let select = this.$refs.selection.getSelection()
      this.selectOrderId = []
      for(let i=0; i<select.length; i++) {
        this.selectOrderId.push(select[i].orderDetailId)
      }
      this.$store.dispatch("doUpdateSelectOrderId", this.selectOrderId);
    },
    // 去結帳的按鈕事件
    handleCheckout() {
      if (localStorage.getItem("userToken")) {
        // 表格沒東西應該就是代表購物車沒東西吧
        if (this.tableData.length == 0) {
          this.$Message.info("購物車內沒有商品喔");
        } else if(this.$store.state.selectOrderId.length == 0) {
          this.$Message.info("請先勾選購買商品");
        } 
        else {
          this.$router.push("/checkout");
        }
      } else {
        // 沒登入的情況
        this.$Message.info("訪客請先登入");
        this.$router.push("/login");
      }
    },
    // 底下分頁要跳到第幾頁
    pIndexChange(page_no) {
      this.getOrder(page_no);
    },
    checkExpirationTime() {
      const decode = jwt_decode(localStorage.getItem("userToken"));
      if (decode.exp * 1000 < Date.now()) {
        this.$Message.error("Token已過期");
        this.$store.dispatch("doLogout");
        this.$router.push("/login");
      } 
    }
  },
  mounted() {
    this.getOrder(1);
    this.$store.dispatch("doUpdateSelectOrderId", [])
  },
};
</script>

<style scoped>
.cart-container {
  background: #eee;
  min-width: 100px;
  padding: 30px 10%;
  height: 100%;
}
</style>