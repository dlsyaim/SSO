import Vue from 'vue'
import Router from 'vue-router'

import BasicLayout from './layout/BasicLayout'
import SignIn from './views/SignIn'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
        {path:'',redirect:'/sign-in'},
        {path:'sign-in',component:SignIn},
        {
          path: 'river-patrol',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/RiverPatrol')
        },
        {
          path: 'problem/wait-deal',
          component: () => import(/* webpackChunkName: "problem" */'./views/problem/WaitDeal')
        },
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
})
