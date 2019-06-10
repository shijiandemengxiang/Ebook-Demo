// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import '@/assets/styles/reset.scss'
import '@/assets/styles/global.scss'
import '@/assets/styles/icon.css'

Vue.use(VueRouter)

//引入组件
import Ebook from "@/Ebook";

//配置组件
const router = new VueRouter({
    routes:[
      {
        path:'/',
        redirect:'/ebook'
      },
      {
        path:'/ebook',
        component:Ebook
      }
    ]
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
