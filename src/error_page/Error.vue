<template>
  <div>
    <p class="error-code">Oop! ERROR!</p>
    <p class="error-text">發生錯誤</p>
    <p class="error-text">現在出了點狀況</p>
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