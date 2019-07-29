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
        {path: 'sign-in', component: SignIn},
        /**
         * 综合首页
         */
        {path: '', redirect: '/home'},
        {path: 'home', component: () => import(/* webpackChunkName: "home" */'./views/home/Home')},
        /**
         * 综合统计分析
         */
        {
          path: 'statistic/river-patrol',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/RiverPatrol')
        },
        {
          path: 'statistic/event',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/Event')
        },
        {
          path: 'statistic/supervise',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/Supervise')
        },
        {
          path: 'statistic/annual-inspection',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/AnnualInspection')
        },
        {
          path: 'statistic/water-quality',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/WaterQuality')
        },
        {
          path: 'statistic/automatic-monitoring-station',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/AutomaticMonitoringStation')
        },
        {
          path: 'statistic/unmanned-aerial',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/UnmannedAerial')
        },
        {
          path: 'statistic/video-monitoring',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/VideoMonitoring')
        },
        {
          path: 'statistic/execution',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/Execution')
        },
        {
          path: 'statistic/data-update',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/DataUpdate')
        },
        {
          path: 'statistic/river-amount',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/RiverAmount')
        },
        {
          path: 'statistic/river-chief-count',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/RiverChiefCount')
        },
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
})
