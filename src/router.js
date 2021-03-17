import Vue from 'vue'
import Router from 'vue-router'
import store from './store.js'
import Register from './components/Register.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
  {
      path: '/register',
      name: 'register',
      component: Register
  },
  ]
})



export default router