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
        /**
         * 信息查询
         */
        {
          path: 'information/river-chief-directory',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-chief-directory/RiverChiefDirectory')
        },
        {
          path: 'information/river-chief-directory/form',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-chief-directory/RiverChiefDirectoryForm')
        },
        {
          path: 'information/one-river-one-policy',
          component: () => import(/* webpackChunkName: "information" */'./views/information/OneRiverOnePolicy')
        },
        {
          path: 'information/supervise-event',
          component: () => import(/* webpackChunkName: "information" */'./views/information/SuperviseEvent')
        },
        /**
         * 河长巡河
         */
        {
          path: 'river-patrol/standing-book',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/StandingBook')
        },
        {
          path: 'river-patrol/rectification-feedback',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/RectificationFeedback')
        },
        {
          path: 'river-patrol/review',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/Review')
        },
        /**
         * 信息报送
         */
        {
          path: 'submitted/information-submitted',
          component: () => import(/* webpackChunkName: "submitted" */'./views/submitted/InformationSubmitted')
        },
        /**
         * 事件处理
         */
        {
          path: 'event/wait-deal',
          component: () => import(/* webpackChunkName: "event" */'./views/event/WaitDeal')
        },
        {
          path: 'event/trace',
          component: () => import(/* webpackChunkName: "event" */'./views/event/Trace')
        },
        {
          path: 'event/comprehensive-query',
          component: () => import(/* webpackChunkName: "event" */'./views/event/ComprehensiveQuery')
        },
        {
          path: 'event/not-handled-on-time',
          component: () => import(/* webpackChunkName: "event" */'./views/event/NotHandledOnTime')
        },
        {
          path: 'event/detail',
          component: () => import(/* webpackChunkName: "event" */'./views/event/EventDetail')
        },
        /**
         * 系统设置
         */
        {
          path: 'setting/user-list',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/user-list/UserList')
        },
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
})
