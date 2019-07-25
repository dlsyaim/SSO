import Vue from 'vue'
import Router from 'vue-router'

import BasicLayout from './layout/BasicLayout'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
        {path: 'river-patrol', component: () => import('./views/river-patrol/RiverPatrol')},
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
})
