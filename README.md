# vue-store
## 介紹
前端用Vue.js寫的小型商店，後端則是用SpringBoot，但後端礙於保密並另外不上傳

## 說明
1. 沒接後端會因為請求失敗而導向錯誤頁面
2. 使用UI元件庫iView，以jwt進行身分驗證
3. 登入時後端有保存session
4. 密碼在前端有DES加密，但前端加密還是會被看到，後端則是使用SHA256加密後存入資料庫
5. 商品圖片的訪問是用從後端取出硬碟的圖片而非直接訪問Vue或SpringBoot的靜態資源
6. 未登入加入購物車會存放在Vuex，待登入再傳到後端保存，已登入則是直接傳到後端保存
7. 結帳頁面不論是否登入都會取得最新的商品價格再計算以確保金額正確
8. /src/assets/commonStyle.css 這個檔案也是出於保密沒有上傳

## 功能
1. Login.vue 登入 / Register.vue 註冊頁面
2. Store.vue 商店主頁 (沒有登入可以瀏覽)
3. Product.vue 商品詳細
4. Cart.vue 購物車
5. Checkout.vue 結帳
6. OrderHistory.vue 顧客訂單記錄
7. /manage/SendCoupon.vue 寄送優惠券
8. /manage/ProductManage.vue 管理商品的價格、數量、圖片等等
9. /manage/OrderManage.vue 管理訂單是否接受
10. /manage/ManageHome.vue 很陽春的管理主頁
11. /manage/CarouselManage.vue 跑馬燈管理
