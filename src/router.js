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
        {path:'sign-in',component:SignIn},
        {path:'',redirect:'/home'},
        {
          path: 'home',
          component: () => import(/* webpackChunkName: "home" */'./views/home/Home')
        },
        {
          path: 'river-patrol',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/RiverPatrol')
        },
        {
          path: 'event/wait-deal',
          component: () => import(/* webpackChunkName: "event" */'./views/event/WaitDeal')
        },
        {
          path: 'event/not-handled-on-time',
          component: () => import(/* webpackChunkName: "event" */'./views/event/NotHandledOnTime')
        },
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
})
