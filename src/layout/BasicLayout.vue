<template>
  <a-layout style="height: 100%" id="layout">
    <a-layout-header id="layoutHeader">
      <div style="display: flex;align-items: center">
        <a-icon style="font-size: 24px;margin-right: 20px;cursor: pointer"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="collapsed=!collapsed"/>
        <img src="../assets/logo.png" width="50"/>
        <h1 style="margin: 0 0 0 10px;white-space: nowrap;color: #fff;cursor: pointer" @click="getMenuList">
          河长制信息管理系统</h1>
      </div>
      <div style="display:flex;justify-content: center;align-items: center">
        <a-icon type="setting" style="font-size: 22px;margin-right: 10px;cursor: pointer" @click="getSettingMenuList"
                title="设置"/>
        <!--<InfoNotice style="margin-right: 14px;cursor: pointer"></InfoNotice>-->
        <CurrentUser></CurrentUser>
      </div>
    </a-layout-header>
    <transition name="sub-menu">
      <ul id="subMenu" v-show="!collapsed&&subMenuList.length!==0" @click="handleMenuClick" @mouseleave ="handleMouseLeave">
        <li class="sub-menu-item" v-for="item in subMenuList" :key="item.id" :data-target="item.funcUrl">{{item.name}}</li>
      </ul>
    </transition>
    <a-layout style="height: 100%;" v-if="menuList.length!==0">
      <a-layout-sider collapsible v-model="collapsed" :trigger="null" class="layout-sider" collapsedWidth="0"
                      @click="handleMenuClick">
        <ul id="menu">
          <li v-for="menu in menuList" :class="{active:menu.id===selectedMenuId}" :key="menu.id" :data-id="menu.id" :data-target="menu.funcUrl" class="menu-item">{{menu.name}}</li>
          <li class="menu-item" @click="getMenuList" v-if="showBackToMainMenu"><a-icon style="margin-right: 10px" type="arrow-left" />返回主菜单</li>
        </ul>
      </a-layout-sider>
      <a-layout-content :style="{overflowY:shouldHiddenOverFlowContent?'hidden':'auto'}" id="layoutContent">
        <transition name="page-toggle" @before-enter="beforeEnter" @after-leave="afterLeave">
          <!--需要缓存组件路由出口-->
          <keep-alive :max="10">
            <router-view  v-if="$route.meta.keepAlive"></router-view>
          </keep-alive>
        </transition>
        <transition name="page-toggle" @before-enter="beforeEnter" @after-leave="afterLeave">
          <!--不需要缓存组件路由出口-->
          <router-view  v-if="!$route.meta.keepAlive"></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {menuList, settingMenuList} from "../config/config";
  import CurrentUser from "./CurrentUser";
  import InfoNotice from "./InfoNotice";
  import {fromEvent} from 'rxjs';
  import {debounceTime,map,filter} from 'rxjs/operators';

  export default {
    components: {CurrentUser},
    data() {
      return {
        collapsed: true,
        menuList: menuList,
        subMenuList: [],
        shouldHiddenOverFlowContent: false,
        subscription:null,
        selectedMenuId:'',
        showBackToMainMenu:false
      }
    },
    mounted(){
      this.subscription=fromEvent(document.getElementById('menu'),'mousemove').pipe(
        debounceTime(100),
        map(e=>e.target.dataset.id),
        filter(id=>!!id)
      ).subscribe(res=>{
        this.subMenuList=this.menuList.find(item=>item.id===res).children;
        if(this.subMenuList.length!==0){
          this.selectedMenuId=res;
        }else {
          this.selectedMenuId='';
        }
      })
    },
    beforeDestroy(){
      this.subscription.unsubscribe();
    },
    methods: {
      handleMenuClick(e) {
        const target = e.target.dataset.target;
        if (target) {
          this.$router.push(target);
        }
      },
      handleMouseLeave(){
        // 这里要延迟一段时间将二级导航菜单置空。
        // 为啥要延迟呢，应该是鼠标移动太快，从一级菜单移动到二级菜单再移出二级菜单，耗时小于防抖时间（这里是100ms），导致二级菜单再鼠标移除后再次出现，
        // 这只是猜测，不太确定
        setTimeout(()=>{
          this.selectedMenuId='';
          this.subMenuList=[];
        },100);
      },
      getMenuList() {
        this.menuList = menuList;
        this.showBackToMainMenu=false;
      },
      getSettingMenuList() {
        this.menuList = settingMenuList;
        this.showBackToMainMenu=true;
      },
      // 进行页面切换时，新旧dom交替，交替前如果没有滚动条，交替过程中出现了滚动条，
      // 就会出现页面抖动，影响体验，所以动画过程中，设置overflowY属性为hidden
      beforeEnter() {
        const target = document.querySelector('#layoutContent');
        const clientHeight = target.clientHeight;
        const scrollHeight = target.scrollHeight;
        // 当页面切换前没有滚动条的时候，才设置overflowY属性为hidden
        if (clientHeight === scrollHeight) {
          this.shouldHiddenOverFlowContent = true;
        }
      },
      afterLeave() {
        this.shouldHiddenOverFlowContent = false;
      }
    }
  }
</script>
<style scoped>
  #layout li span {
    font-size: 16px;
  }

  #layoutHeader {
    box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
    background-color: #438AFE;
    color: #fff;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: nowrap;
    z-index: 10;
  }

  .layout-sider {
    height: 100%;
    background-color: #EDEDED;
    overflow-y: auto;
  }

  #menu {
    list-style: none;
    background-color: #EDEDED;
    width: 100%;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
  }

  .menu-item {
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    font-size: 16px;
    border-bottom: 1px solid #dddddd;
  }

  .menu-item:hover {
    background-color: #4972CE;
    color: #FFFFFF;
  }

  .active{
    background-color: #4972CE;
    color: #FFFFFF;
  }

  #subMenu {
    position: absolute;
    list-style: none;
    left: 200px;
    top: 64px;
    padding: 0;
    height: calc(100% - 78px);
    overflow-y: auto;
    background-color: rgba(114,152,237,.9);
    z-index: 400;
  }

  .sub-menu-item {
    font-size: 16px;
    display: flex;
    cursor: pointer;
    color: #ffffff;
    width: 300px;
    align-items: center;
    padding: 0 30px;
    height: 50px;
  }

  .sub-menu-item:hover {
    background-color: #4972CE;
  }

  .layout-sider::-webkit-scrollbar {
    width: 4px;
  }

  .layout-sider::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  .layout-sider::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  /*页面切换动画*/
  .page-toggle-enter-active {
    transition: opacity .3s ease-in .25s;
  }

  .page-toggle-leave-active {
    transition: opacity .3s ease-out 0s;
  }

  .page-toggle-enter, .page-toggle-leave-to {
    opacity: 0;
  }

  /*二级菜单动画*/
  .sub-menu-enter-active {
    animation: bounce-in .3s;
  }

  .sub-menu-leave-active {
    animation: bounce-in .3s reverse;
  }

  .sub-menu-enter, .sub-menu-leave-to {
    width: 0;
  }

  @keyframes bounce-in {
    0% {
      width: 0;
    }
    100% {
      width: 300px;
    }
  }
</style>

