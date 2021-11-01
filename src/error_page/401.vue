<template>
  <div>
    <p class="error-code">401 Unauthorized</p>
    <p class="error-text">發送的請求缺乏身份驗證憑證</p>
    <p class="error-text" style="color: red;"><router-link to="/store">點我返回商店</router-link></p>
  </div>
</template>

<style scoped>
.error-code {
  font-size: 50px;
  text-align: center;
  font-weight: bold;
}
.error-text {
  font-size: 20px;
  text-align: center;
}
</style>