<template>
  <div>
    <p class="error-code">403 Forbidden</p>
    <p class="error-text">沒有權限存取這個頁面喔</p>
    <p class="error-text">這裡不是你該來的地方 :(</p>
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