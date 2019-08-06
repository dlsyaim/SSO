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
  import pdf from 'pdfobject';
  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      height:{
        type:String,
        default:'600px'
      }
    },
    mounted(){
      pdf.embed(this.src, "#pdfContainer");
    }
  }
</script>
