<template>
  <div class="login-container">
    <Form ref="loginForm" :model="loginForm" class="login-form" :rules="loginRules">
      <div class="title-container">
        <h3 class="title">使用者登入</h3>
      </div>
      <Form-item prop="email">
        <Input v-model="loginForm.email" placeholder="請輸入信箱">
          <Icon type="ios-mail-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input
          type="password"
          v-model="loginForm.password"
          placeholder="請輸入密碼"
          @keyup.native="checkCapslock"
        >
          <Icon type="ios-lock-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>
      <Button type="primary" @click="handleLogin">登入</Button>
      <div>
        <Button type="error" class="btn-switch" @click="switchIdentity('admin')">管理員</Button>
        <Button type="success" class="btn-switch" @click="switchIdentity('feng')">Feng</Button>
        <Button type="success" class="btn-switch" @click="switchIdentity('gary')">Gary</Button>
        <Button type="warning" class="btn-switch" @click="switchIdentity('clear')">清空</Button>
      </div>
      <div class="tips">
        <span style="margin-right: 20px">還沒有帳戶嗎?</span>
        <span class="hover">
          <router-link to="/register">註冊</router-link>
        </span>
        <span class="hover">
          <router-link to="/store">前往商店</router-link>
        </span>
      </div>
    </Form>
  </div>
</template>

<script>
import jwt_decode from "jwt-decode";
import axios from "axios";
import {doDESencrypt} from "@/misc/DES-crypto";

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      if (
        value.split("@")[1] === "" ||
        value.replace(/^\s+|\s+$/g, "") === ""
      ) {
        callback(new Error("信箱格式錯誤"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 8) {
        callback(new Error("密碼必須至少包含8個字元"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        email: "",
        password: ""
      },
      capsTooltip: false,
      loginRules: {
        email: [{ trigger: "blur", validator: validateEmail }],
        password: [{ trigger: "blur", validator: validatePassword }]
      }
    };
  },
  methods: {
    // 檢查密碼輸入是否為大寫
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
      if (this.capsTooltip) {
        this.$Message.warning("輸入到大寫");
      }
    },
    // 登入
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          // 深層複製，不然會改到原始變數
          const form = JSON.parse(JSON.stringify(this.loginForm))
          form.password = doDESencrypt(form.password)
          try {
            let res = await axios.post(
              "/user/login",
              JSON.stringify(form), {headers: {"Content-Type": "application/json"}}
            );
            if (res.data.body == "err") {
              // 成功的話回傳並不是ok
              this.$Message.error("信箱或密碼錯誤");
            } else {
              // 不是err就是token了，加入localStorage
              const token = res.data.body;
              localStorage.setItem("userToken", token);
              try {
                // 解析token
                const decode = jwt_decode(token);

                // 更新session
                this.$store.dispatch("doUpdateIdentity", decode.identity);
                this.$store.dispatch("doUpdateName", decode.name);

                if(this.$store.state.cart.length > 0) {
                  let nowCart = this.$store.state.cart

                  // todo優化，暫時用for迴圈加訂單，以後要改
                  for (let i=0; i<nowCart.length; i++) {
                    const form = {
                      num: nowCart[i].num,
                      productId: nowCart[i].productId,
                    };
                    try {
                      await axios.post("/order/add", form);
                    } catch (err) {
                      this.$Message.error("添加訂單失敗");
                    }
                  }
                  this.$store.dispatch("doUpdateCart", [])
                }

                this.$Message.success("登入成功");
                this.$router.push("/store");
              } catch {
                // 解析token失敗
                this.$Message.error("登入驗證失敗");
              }
            }
          } catch (err) {
            this.$Message.error("登入失敗，請稍後再試");
          }
        }
      });
    },
    // 快速填入帳密的按鈕，可以拿掉
    switchIdentity(identity) {
      switch (identity) {
        case "admin":
          this.loginForm.email = "admin@email.com";
          this.loginForm.password = "admin123";
          break;
        case "feng":
          this.loginForm.email = "feng@email.com";
          this.loginForm.password = "feng1234";
          break;
        case "gary":
          this.loginForm.email = "gary@email.com";
          this.loginForm.password = "gary1234";
          break;
        default:
          this.loginForm.email = "";
          this.loginForm.password = "";
      }
    }
  }
};
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .ivu-input ivu-input-default {
    color: $cursor;
  }
}
/* reset css */
.login-container {
  .ivu-input {
    display: inline-block;
    height: 47px;
    // width: 85%;
    font-size: 20px;
    ivu-input-default {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .ivu-form-item-content {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .hover {
    color: #e2b06e;
    margin-bottom: 10px;
    margin-left: 20px;
  }
  .hover:hover {
    color: #ff6347;
    margin-bottom: 10px;
    margin-left: 30px;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .ivu-btn {
    width: 100%;
    margin-bottom: 30px;
    height: 42px;
    font-size: 20px;
  }
  .btn-switch {
    width: 22%;
    margin: 0 5px 25px 5px;
  }
}
</style>