<template>
  <div>
    <p class="error-code">404 Not Found</p>
    <p class="error-text">這個頁面不存在喔</p>
    <p class="error-text">尼一定是走錯路了 :)</p>
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