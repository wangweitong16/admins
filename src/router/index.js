import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect:'/login'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: '/home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
    children:[
      // {
      //   path:'/',
      //   redirect:''
      // },
      // 商品列表
      {
        path:'goods',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/goods.vue')
      },
      {
        path:'addgoods',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/addgoods.vue')
      },
      // 分类参数
      {
        path:'params',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/params.vue')
      },
      // 商品分类
      {
        path:'categories',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/categories.vue')
      },
      
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
