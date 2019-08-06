import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/SignIn'
import Ahome from '@/views/Index'
import Shome from '@/views/SignInindex'
Vue.use(Router);

export default new Router({
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
    {
      path: '/a_index',
      name: 'A',
      component: Ahome
    }
  ]
})
