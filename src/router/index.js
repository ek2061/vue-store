import Vue from "vue"
import VueRouter from "vue-router"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    redirect: "/store",
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue")
  },
  {
    path: "/register",
    component: () => import("@/views/Register.vue")
  },
  {
    path: "/store",
    component: () => import("@/views/Store.vue")
  },
  {
    path: "/cart",
    component: () => import("@/views/Cart.vue")
  },
  {
    path: "/product/:id",
    component: () => import("@/views/Product.vue")
  },
  {
    path: "/checkout",
    component: () => import("@/views/Checkout.vue")
  },
  {
    path: "/401",
    component: () => import("@/error_page/401.vue")
  },
  {
    path: "/403",
    component: () => import("@/error_page/403.vue")
  },
  {
    path: "/error",
    component: () => import("@/error_page/Error.vue")
  },
  {
    path: "/orderHistory",
    component: () => import("@/views/OrderHistory.vue")
  },
  {
    path: "/manage/home",
    component: () => import("@/views/manage/ManageHome"),
  },
  {
    path: "/manage/orderManage",
    component: () => import("@/views/manage/OrderManage.vue")
  },
  {
    path: "/manage/productManage",
    component: () => import("@/views/manage/ProductManage.vue")
  },
  {
    path: "/manage/sendcoupon",
    component: () => import("@/views/manage/SendCoupon.vue")
  },
  {
    path: "/manage/carouselManage",
    component: () => import("@/views/manage/CarouselManage.vue")
  },
  {
    path: '*',
    component: () => import("@/error_page/404.vue")
  },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
})

import store from '@/store'

// 路由守衛
router.beforeResolve((to, from, next) => {
  const isAdmin = store.state.identity === "admin" ? true : false
  if (to.path != "/manage" && to.path != "/manage/productManage" && to.path != "/manage/orderManage") {
    next()
  } else {
    isAdmin ? next() : next("/403")
  }
})

// 避免router.push到相同路由跑出紅字
// https://juejin.cn/post/6844904013654130696
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return routerPush.call(this, location, onResolve, onReject);
  return routerPush.call(this, location).catch(error=> error)
};

// router.beforeEach((to, from, next) => {

// })

export default router
