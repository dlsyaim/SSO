import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/SignIn'
import Shome from '@/views/SignInindex'
Vue.use(Router);

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/Shome',
      name: 'Shome',
      component: Shome
    },
  ]
})
