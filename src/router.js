import Vue from 'vue'
import Router from 'vue-router'

import BasicLayout from './layout/BasicLayout'
import {BASE_URL, SSO_CENTER_URl} from "./config/config";
import {formatLocationSearch} from "./util/formatLocationSearch";
import {get,post} from "./util/axios";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: BasicLayout,
      children: [
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
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/RiverPatrol'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'statistic/river-patrol-detail',
          component: () => import(/* webpackChunkName: "statistic" */'./views/statistic/RiverPatrolDetail')
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
          path: 'information/river-chief-directory/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-chief-directory/RiverChiefDirectoryForm')
        },
        {
          path: 'information/river-chief-directory/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-chief-directory/FormEdit')
        },
        {
          path: 'information/reach',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reach/ReachList')
        },
        {
          path: 'information/reach/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reach/ReachAdd')
        },
        {
          path: 'information/reach/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reach/ReachEdit')
        },
        {
          path: 'information/reach/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reach/ReachDetail')
        },
        {
          path: 'information/river',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river/RiverList')
        },
        {
          path: 'information/river/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river/RiverAdd')
        },
        {
          path: 'information/river/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river/RiverEdit')
        },
        {
          path: 'information/river/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river/RiverDetail')
        },
        {
          path: 'information/pond',
          component: () => import(/* webpackChunkName: "information" */'./views/information/pond/PondList')
        },
        {
          path: 'information/pond/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/pond/PondAdd')
        },
        {
          path: 'information/pond/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/pond/PondEdit')
        },
        {
          path: 'information/pond/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/pond/PondDetail')
        },
        {
          path: 'information/lake',
          component: () => import(/* webpackChunkName: "information" */'./views/information/lake/LakeList')
        },
        {
          path: 'information/lake/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/lake/LakeAdd')
        },
        {
          path: 'information/lake/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/lake/LakeEdit')
        },
        {
          path: 'information/lake/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/lake/LakeDetail')
        },
        {
          path: 'information/river-system',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-system/RiverSystemList')
        },
        {
          path: 'information/river-system/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-system/RiverSystemAdd')
        },
        {
          path: 'information/river-system/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-system/RiverSystemEdit')
        },
        {
          path: 'information/river-system/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/river-system/RiverSystemDetail')
        },
        {
          path: 'information/reservoir',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reservoir/ReservoirList')
        },
        {
          path: 'information/reservoir/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reservoir/ReservoirAdd')
        },
        {
          path: 'information/reservoir/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reservoir/ReservoirEdit')
        },
        {
          path: 'information/reservoir/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/reservoir/ReservoirDetail')
        },
        {
          path: 'information/basin',
          component: () => import(/* webpackChunkName: "information" */'./views/information/basin/BasinList')
        },
        {
          path: 'information/basin/add',
          component: () => import(/* webpackChunkName: "information" */'./views/information/basin/BasinAdd')
        },
        {
          path: 'information/basin/edit',
          component: () => import(/* webpackChunkName: "information" */'./views/information/basin/BasinEdit')
        },
        {
          path: 'information/basin/detail',
          component: () => import(/* webpackChunkName: "information" */'./views/information/basin/BasinDetail')
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
         * 信息发布
         */
        {
          path: 'publish/info-publish',
          component: () => import(/* webpackChunkName: "publish" */'./views/publish/publish/InformationPublish'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'publish/info-publish/detail',
          component: () => import(/* webpackChunkName: "publish" */'./views/publish/publish/detail')
        },
        /**
         * 河长巡河
         */
        {
          path: 'river-patrol/standing-book',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/standing-book/StandingBookList'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'river-patrol/standing-book/detail',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/standing-book/StandingBookDetail')
        },
        {
          path: 'river-patrol/rectification-feedback',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/RectificationFeedback')
        },
        {
          path: 'river-patrol/review',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/Review')
        },
        {
          path: 'river-patrol/problem-feedback',
          component: () => import(/* webpackChunkName: "river-patrol" */'./views/river-patrol/ProblemFeedback')
        },
        /**
         * 监督督导
         */
        {
          path: 'supervise/supervise',
          component: () => import(/* webpackChunkName: "supervise" */'./views/supervise/supervise/SuperviseList')
        },
        {
          path: 'supervise/bulletin',
          component: () => import(/* webpackChunkName: "supervise" */'./views/supervise/Bulletin')
        },
        {
          path: 'supervise/interview-meeting',
          component: () => import(/* webpackChunkName: "supervise" */'./views/supervise/InterviewMeeting')
        },
        /**
         * 公众投诉
         */
        {
          path: 'complaint',
          component: () => import(/* webpackChunkName: "complaint" */'./views/complaint/PublicComplaint')
        },
        /**
         * 信息报送
         */
        {
          path: 'submitted/information-submitted',
          component: () => import(/* webpackChunkName: "submitted" */'./views/submitted/InformationSubmitted')
        },
        {
          path: 'submitted/submitted-statistic',
          component: () => import(/* webpackChunkName: "submitted" */'./views/submitted/SubmittedStatistic')
        },
        /**
         * 事件处理
         */
        {
          path: 'event/wait-deal',
          component: () => import(/* webpackChunkName: "event" */'./views/event/WaitDeal'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'event/trace',
          component: () => import(/* webpackChunkName: "event" */'./views/event/Trace'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'event/comprehensive-query',
          component: () => import(/* webpackChunkName: "event" */'./views/event/ComprehensiveQuery'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'event/not-handled-on-time',
          component: () => import(/* webpackChunkName: "event" */'./views/event/NotHandledOnTime'),
          meta:{
            keepAlive:true
          }
        },
        {
          path: 'event/detail',
          component: () => import(/* webpackChunkName: "event" */'./views/event/EventDetail')
        },
        /**
         * 河长制考核
         */
        {
          path: '/check/river-chief-check',
          component: () => import(/* webpackChunkName: "check" */'./views/check/RiverChiefCheck')
        },
        /**
         * 系统设置
         */
        {
          path: 'setting/user-list',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/user-list/UserList')
        },
        {
          path: 'setting/user-list/add',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/user-list/UserFormAdd')
        },
        {
          path: 'setting/user-list/edit',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/user-list/UserFormEdit')
        },
        {
          path: 'setting/role',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/RoleSetting')
        },
        {
          path: 'setting/menu',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/menu/MenuList')
        },
        {
          path: 'setting/wechat',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/WeChatBackend')
        },
        {
          path: 'setting/rating-ratio',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/RatingRatio')
        },
        {
          path: 'setting/handle-time',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/HandleTimeSetting')
        },
        {
          path: 'setting/assessment-score',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/AssessmentScore')
        },
        {
          path: 'setting/reach-assessment',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/ReachAssessment')
        },
        {
          path: 'setting/scoring-rules',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/ScoringRules')
        },
        {
          path: 'setting/scoring-rules/f',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/score-rules/RuleF')
        },
        {
          path: 'setting/scoring-rules/k',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/score-rules/RuleK')
        },
        {
          path: 'setting/menu-permission',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/MenuPermission')
        },
        {
          path: 'setting/role-permission',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/RolePermission')
        },
        {
          path: 'setting/app-menu-permission',
          component: () => import(/* webpackChunkName: "setting" */'./views/setting/AppMenuPermission')
        },
        {path: '*', component: () => import('./views/exception/PageNotFound')}
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  const token=sessionStorage.getItem('Access-Token');
  // 判断是否有token，有token正常进行导航
  if(!token){
    // 没有token看看是否由SSO登录中心登录完成，带着ST跳转而来
    const query=formatLocationSearch(window.location.search);
    if(query.ST){
      // 有st，拿st换老系统token
      post(`${BASE_URL}/uip/login/loginWithSt?st=${query.ST}`).then(res=>{
        if(res.resCode===1){
          getMenuList(res.data.userDTO.id);
          sessionStorage.setItem('userDTO',JSON.stringify(res.data.userDTO));
          const token=res.data.tokenInfo.token;
          sessionStorage.setItem('Access-Token',token);
          // 登录成功,获取到菜单后除去遮罩层
          closeLayer();
          next();
        }else {
          window.location.href=`${SSO_CENTER_URl}?from=${window.location.host}${window.location.path?window.location.path:''}&info=v3`;
        }
      });
    }else {
      //没有st，去登录中心获取st
      window.location.href=`${SSO_CENTER_URl}?from=${window.location.href}&info=v3`;
    }
  }else {
    next();
  }
});

function getMenuList(userId) {
  get(`${BASE_URL}/uip/smAuthority/queryUserAuthorizedMenuTree?userId=${userId}`).then(res=>{
    if(res.resCode===1){
      sessionStorage.setItem('menuList',JSON.stringify(res.data));
    }
  })
}

function closeLayer(){
  const preloader = document.querySelector('.preloader');
  preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
  setTimeout(function () {
    preloader.className += ' preloader-hidden';
  }, 750);
}

export default router;
