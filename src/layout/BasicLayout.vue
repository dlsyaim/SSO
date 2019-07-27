<template>
  <a-layout style="height: 100%" id="layout">
    <a-layout-header id="layoutHeader">
      <div style="display: flex;align-items: center">
        <a-icon style="font-size: 24px;margin-right: 20px;cursor: pointer"
                :type="collapsed ? 'menu-unfold' : 'menu-fold'" @click="collapsed=!collapsed"/>
        <img src="../assets/logo.png" width="50"/>
        <h1 style="margin: 0 0 0 10px;white-space: nowrap;color: #fff;">西青区河长制信息管理系统</h1>
      </div>
      <div style="display:flex;justify-content: center;align-items: center">
        <InfoNotice style="margin-right: 14px;cursor: pointer"></InfoNotice>
        <CurrentUser></CurrentUser>
      </div>
    </a-layout-header>
    <a-layout style="height: 100%" v-if="menuList.length!==0">
      <a-layout-sider collapsible v-model="collapsed" :trigger="null" class="layout-sider" collapsedWidth="0">
        <ul id="menu" @mouseover="handleMouseHover">
          <template v-for="menu in menuList">
            <li v-if="menu.children.length===0" :key="menu.id" class="menu-item">{{menu.name}}</li>
            <a-popover :title="null" placement="rightTop" v-else>
              <template slot="content">
                <ul id="subMenu">
                  <li class="sub-menu-item" v-for="subMenu in subMenuList" :key="subMenu.id"
                      :style="{backgroundColor:(selectedMenuId===subMenu.id?'#f2f2f2':'')}">{{subMenu.name}}
                  </li>
                </ul>
              </template>
              <li :data-id="menu.id" :key="menu.id" class="menu-item">{{menu.name}}</li>
            </a-popover>
          </template>
        </ul>
      </a-layout-sider>
      <a-layout-content>
        <transition name="page-toggle">
          <router-view></router-view>
        </transition>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {menuList} from "../config/config";
  import CurrentUser from "./CurrentUser";
  import InfoNotice from "./InfoNotice";

  export default {
    components: {CurrentUser, InfoNotice},
    data() {
      return {
        collapsed: false,
        menuList: menuList,
        subMenuList: [],
        showSubmenu: false
      }
    },
    computed: {
      selectedMenuId() {
        return -1;
      }
    },
    methods: {
      handleMouseHover(e) {
        const id = e.target.dataset.id;
        if (id) {
          this.subMenuList = this.menuList.find(item => item.id.toString() === id).children;
        }
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
    background-color: #438AFE;
    overflow-y: auto;
  }

  #menu {
    list-style: none;
    background-color: #3366ff;
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
    color: #ffffff;
    font-size: 16px;
    border-bottom: 1px solid #438AFE;
    transition: all .3s ease-in-out;
  }

  .menu-item:hover {
    background-color: #2B52A8;
  }

  #subMenu {
    padding: 0;
    list-style: none;
    cursor: pointer;
    transition: all .3s ease-in-out;
  }

  .sub-menu-item {
    font-size: 16px;
    display: flex;
    width: 200px;
    align-items: center;
    justify-content: center;
    height: 50px;
  }

  .sub-menu-item:hover {
    background-color: #f2f2f2;
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
    transition: opacity .2s ease-in .25s;
  }

  .page-toggle-leave-active {
    transition: opacity .2s ease-out 0s;
  }

  .page-toggle-enter, .page-toggle-leave-to {
    opacity: 0;
  }
</style>

