import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Register from './components/Register.vue'
import Login from './components/Login.vue'
import Product from './components/Product.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },  
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'product',
      component: Product,
      meta: {
        requiresAuth: true
      }
    },
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
    next() 
  }
})

export default router