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
      {
        path:'goods',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/goods.vue')
      },
      {
        path:'addgoods',
        component:()=>import(/* webpackChunkName: "goods" */ '../views/goods/addgoods.vue')
      },
      
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
