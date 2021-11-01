<template>
  <div class="register-container">
    <Form ref="registerForm" :model="registerForm" class="register-form" :rules="registerRules">
      <div class="title-container">
        <h3 class="title">使用者註冊</h3>
      </div>
      <Form-item prop="email">
        <Input v-model="registerForm.email" placeholder="請輸入信箱">
          <Icon type="ios-mail-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="name">
        <Input v-model="registerForm.name" placeholder="請輸入姓名">
          <Icon type="ios-person-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input
          type="password"
          v-model="registerForm.password"
          placeholder="請輸入密碼"
          @keyup.native="checkCapslock"
        >
          <Icon type="ios-lock-outline" slot="prepend" size="25"></Icon>
        </Input>
      </Form-item>
      <Button type="primary" @click="handleRegister">註冊</Button>
      <div class="tips">
        <span style="margin-right: 20px">已經有帳戶了嗎?</span>
        <span class="hover">
          <router-link to="/login">登入</router-link>
        </span>
        <span class="hover">
          <router-link to="/store">前往商店</router-link>
        </span>
      </div>
    </Form>
  </div>
</template>

<script>
import axios from "axios";
import {doDESencrypt} from "@/misc/DES-crypto";

export default {
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value.split("@")[1] === "" || value.replace(/^\s+|\s+$/g, "") === "") {
        callback(new Error("信箱格式錯誤"));
      } else {
        callback();
      }
    };
    const validateName = (rule, value, callback) => {
      if (value.replace(/^\s+|\s+$/g, "") === "") {
        callback(new Error("姓名不能為空"));
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
      registerForm: {
        email: "",
        name: "",
        password: ""
      },
      capsTooltip: false,
      registerRules: {
        email: [{ trigger: "blur", validator: validateEmail }],
        name: [{ trigger: "blur", validator: validateName }],
        password: [{ trigger: "blur", validator: validatePassword }]
      }
    };
  },
  methods: {
    checkCapslock(e) {
      const { key } = e;
      this.capsTooltip = key && key.length === 1 && key >= "A" && key <= "Z";
      if (this.capsTooltip) {
        this.$Message.warning("輸入到大寫");
      }
    },
    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          // 深層複製，不然會改到原始變數
          const form = JSON.parse(JSON.stringify(this.registerForm))
          form.password = doDESencrypt(form.password)
          try {
            let res = await axios.post(
              "/user/register",
              JSON.stringify(form), {headers: {"Content-Type": "application/json"}}
            );
            if (res.data.body === "ok") {
              this.$Message.success("註冊成功");
              this.$router.push("/login")
            } else {
              this.$Message.success("註冊失敗");
            }
          } catch (err) {
            this.$Message.error("註冊發生錯誤，請稍後再試");
          }
        }
      });
    }
  }
};
</script>

<style lang="scss">
$bg: #259b90;
$light_gray: #fff;
$cursor: #fff;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .register-container .ivu-input ivu-input-default {
    color: $cursor;
  }
}
/* reset css */
.register-container {
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
$bg: #2aa198;
$dark_gray: #889aa4;
$light_gray: #eee;
.register-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;
  .register-form {
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
}
</style>