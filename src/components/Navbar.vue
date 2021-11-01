<template>
  <header class="head-nav">
    <Row>
      <Col :span="7" class="logo-container">
        <router-link to="/store">
          <img src="../assets/logo.png" class="logo" alt />
          <span class="title">Store</span>
        </router-link>
      </Col>
      <Col :span="17" class="user">
        <div class="userinfo">
          <div class="welcome">
            <div class="Mobile">
              <p class="name gusetname">{{this.identityList[this.$store.state.identity]}}</p>
              <p class="name gusetname">{{this.$store.state.name}}</p>
              <Dropdown @on-click="changeMenu">
                <a href="javascript:void(0)">
                  <Icon type="ios-keypad-outline"></Icon>
                </a>
                <Dropdown-menu slot="list">
                  <Dropdown-item name="logout" v-show="this.nowIdentity !== 'guest'">
                    <Icon type="ios-share"></Icon>登出
                  </Dropdown-item>
                  <Dropdown-item name="login" v-if="this.nowIdentity == 'guest'">
                    <Icon type="ios-paper-plane"></Icon>登入
                  </Dropdown-item>
                  <Dropdown-item name="register" v-if="this.nowIdentity == 'guest'">
                    <Icon type="ios-person-add"></Icon>註冊
                  </Dropdown-item>
                  <Dropdown-item name="manage" v-if="nowIdentity==='admin'">
                    <Icon type="ios-settings"></Icon>管理介面
                  </Dropdown-item>
                  <Dropdown-item name="cart" v-if="this.nowIdentity !== 'admin'">
                    <Icon type="ios-cart"></Icon>購物車
                  </Dropdown-item>
                  <Dropdown-item
                    name="order"
                    v-if="this.nowIdentity !== 'guest' && this.nowIdentity !== 'admin'"
                  >
                    <Icon type="ios-paper"></Icon>訂單記錄
                  </Dropdown-item>
                </Dropdown-menu>
              </Dropdown>
            </div>

            <div class="Desk">
              <span v-if="nowIdentity==='admin'" style="font-size: 15px; color: orange;">
                <router-link to="/manage/home">
                  <u>前往管理員頁面</u>
                </router-link>
              </span>
              <div class="welcome logout" v-show="this.nowIdentity !== 'guest'">
                <Button class="name hover" @click="logout">
                  <Icon type="ios-share"></Icon>登出
                </Button>
              </div>
              <div class="welcome logoin" v-if="this.nowIdentity == 'guest'">
                <Button class="name hover" to="/login">
                  <Icon type="ios-paper-plane"></Icon>登入
                </Button>
              </div>
              <div class="welcome register" v-if="this.nowIdentity == 'guest'">
                <Button class="name hover" @click="register">
                  <Icon type="ios-person-add"></Icon>註冊
                </Button>
              </div>
              <p class="name gusetname">{{this.identityList[this.$store.state.identity]}}</p>
              <p class="name gusetname">{{this.$store.state.name}}</p>
              <p class="name comename">您好</p>
              <Button v-if="this.nowIdentity !== 'admin'" to="/cart">
                <Icon type="ios-cart"></Icon>購物車
              </Button>
              <Button
                v-if="this.nowIdentity !== 'guest' && this.nowIdentity !== 'admin'"
                to="/orderHistory"
              >
                <Icon type="ios-paper"></Icon>訂單記錄
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  </header>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      identityList: {
        guest: "訪客",
        admin: "管理員",
        customer: "顧客"
      },
      nowIdentity: this.$store.state.identity || "guest",
      nowCart: this.$store.state.cart || []
    };
  },
  methods: {
    changeMenu(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "login":
          this.$router.push("/login");
          break;
        case "register":
          this.$router.push("/register");
          break;
        case "cart":
          this.$router.push("/cart");
          break;
        case "manage":
          this.$router.push("/manage/home");
          break;
        case "order":
          this.$router.push("/orderHistory");
          break;
        default:
          break;
      }
    },
    // 登出按鈕事件
    logout() {
      localStorage.removeItem("userToken");
      this.$store.dispatch("doLogout");
      this.$router.push("/login");
    },
    // 註冊按鈕事件
    register() {
      localStorage.removeItem("userToken");
      this.$store.dispatch("doLogout");
      this.$router.push("/register");
    }
  }
};
</script>
<style scoped>
.head-nav {
  width: 100%;
  padding: 5px;
  background: #324057;
  color: #fff;
  border-bottom: 1px solid #1f2d3d;
}
.logo-container {
  line-height: 50px;
}
.logo {
  height: 50px;
  width: 50px;
  margin-right: 5px;
  vertical-align: middle;
  display: inline-block;
}
.title {
  vertical-align: middle;
  font-size: 22px;
  font-family: "Microsoft YaHei";
  letter-spacing: 3px;
}
.user {
  line-height: 54px;
  text-align: right;
  float: right;
  padding-right: 10px;
}
.welcome {
  display: inline-block;
  width: auto;
  vertical-align: middle;
  padding: 0 1rem;
}
.name {
  line-height: 20px;
  font-size: 14px;
  display: inline-block;
}
.comename {
  font-size: 12px;
  display: inline-block;
}
.gusetname {
  color: #409eff;
  font-weight: bolder;
}
.cart {
  cursor: pointer;
  margin-right: 6px;
}
.hover:hover {
  color: #ff6347;
}

@media screen and (max-width: 630px) {
  .Desk {
    display: none;
  }
  .title {
    display: none;
  }
}
@media screen and (min-width: 630px) {
  .Mobile {
    display: none;
  }
}
</style>