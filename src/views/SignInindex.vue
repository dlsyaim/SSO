<template>
  <div :style="backgroundDiv">
    <Header header="西青区河长制信息管理平台"></Header>
    <a-row>
      <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
          breakpoint="lg"
          collapsedWidth="0"
          @collapse="onCollapse"
          @breakpoint="onBreakpoint"
          style="text-align: center;background: white;border-radius: 15px;height: 600px;width: 300px;flex:0 0 300px;max-width: 300px"
        >
          <img style="margin-top: 20px;margin-bottom: 20px" src="../assets/logo.png" width="100"/>
          <h1 id="c_user_name">{{callback_username}}</h1>
          <div id="c_user_info">
            <p>单位：{{callback_company}}</p>
            <p>部门：{{callback_department}}</p>
          </div>
          <a-button id="logout" @click="logout">退出</a-button>
        </a-layout-sider>
        <a-layout id="c_content" style="height: 600px">
          <div
            style="text-align: center;font-size: 18px;padding-top: 20px;padding-bottom: 20px;background-color: rgba(245, 245, 245, 1);">
            <b><a-icon type="windows" /> 应用系统</b>
          </div>
          <a-row id="c_content_model" style="text-align: center">
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(228, 76, 39, 1)"><a v-on:click="login('v3')">河长制综合管理系统</a></a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgba(238, 13, 83, 1)"><a v-on:click="login('v5')">水系末端调查处理系统</a></a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(68, 77, 92, 1)"><a v-on:click="login('v4')">无人机巡河管理系统</a></a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgba(56, 175, 183, 1)"><a v-on:click="login('v7')">视频监控异常预警系统</a></a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(1, 82, 147, 1)"><a v-on:click="login('v6')">水质监测预警系统</a></a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgb(28,168,238)"><a v-on:click="login('v8')">水务大数据信息管理系统</a></a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(51, 153, 102, 1)"><a v-on:click="login('v2')">河长制内部信息网管理后台</a></a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgb(238,156,50)"><a target="_blank" href="http://61.240.12.212:9096/">河长制内部信息网</a></a-col>
          </a-row>
        </a-layout>
      </a-layout>
    </a-row>
  </div>
</template>
<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";
  import {GetQueryString} from "../config/config";
  import {BASE_URLimg} from "../config/config";
  export default {
    data() {
      return {
        backgroundDiv: {
          backgroundImage: 'url(' + require('../assets/background.png') + ')'
        },
        ST:localStorage.getItem('ST'),
        collapsed: false,
        callback_username: localStorage.getItem('callback_username'),
        callback_company: localStorage.getItem('callback_company'),
        callback_department: localStorage.getItem('callback_department'),
        callback_workno: localStorage.getItem('callback_workno'),
      }
    },
    created() {
      this.indexif();
    },
    beforeCreate() {
    },
    methods: {
      onCollapse(collapsed, type) {
        console.log(collapsed, type);
      },
      onBreakpoint(broken) {
        console.log(broken);
      },
      indexif() {
        console.log(GetQueryString('a'));
        if (localStorage.getItem('Token')) {
        } else {
          this.$message.error(`请先登录`);
          setTimeout(() => {
            window.location.href = "/";
          }, 1000);
        }
      },
      login(e){
        if (localStorage.getItem('Token')) {
          post(`${BASE_URL}/v1/auth/getSt`, null, null).then(res => {
            if (res.code === 200) {
              localStorage.setItem('ST', res.results.st);
              /*
              v2:外部官网后台管理
              v3:河长制管理系统
              v4:无人机巡河系统
              v5:水系末端
              v6:水质监测
              v7:视频监控
              v8:水系大数据
              */
              if (e === 'v2') {
                window.open("http://61.240.12.212:9084?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              }
              else if (e === 'v3') {
                window.open("http://61.240.12.212:9080/hzz/home?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9080/hzz/?ST=" + localStorage.getItem('ST');
              } else if (e === 'v4') {
                window.open("http://61.240.12.212:9087?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9087?ST=" + localStorage.getItem('ST');
              } else if (e === 'v5') {
                window.open("http://61.240.12.212:9088?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9086?ST=" + localStorage.getItem('ST');
              } else if (e === 'v6') {
                window.open("http://61.240.12.212:9086?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (e === 'v7') {
                window.open("http://61.240.12.212:9085?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (e === 'v8') {
                window.open("http://61.240.12.212:9089?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else {
                window.open("/?ST=" + localStorage.getItem('ST'));
                // window.location.href = "http://61.240.12.212:9081/Shome?ST" + localStorage.getItem('ST');
              }
            }
            else {
               this.logout();
            }
          });
        } else {
          this.logout();
        }
      },
      logout() {
        localStorage.clear();
        window.location.href="/";
      }
    },
  };
</script>
<style>
  #c_content_model a{
    color: white;
  }
  #components-layout-demo-responsive .logo {
    height: 32px;
    margin: 16px;
  }

  #components-layout-demo-responsive {
    width: 80%;
    margin-left: 10%;
    margin-top: 10vh;
    min-height: 83.2vh;
    background: transparent;
  }

  #c_content {
    margin-left: 50px;
    border-radius: 15px;
    background: white;
  }

  #c_user_info p {
    border-bottom: 1px black solid;
    padding-bottom: 10px;
    margin-left: 8px;
    margin-right: 8px;
  }

  #c_user_name {
    border-bottom: 1px black solid;
    padding-bottom: 10px;
    margin-left: 8px;
    margin-right: 8px;
  }

  #logout {
    left: 0;
    top: 0;
    width: 140px;
    height: 40px;
    background: inherit;
    background-color: rgba(254, 0, 0, 1);
    border: 0 none;
    border-radius: 5px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: white;
  }

  #c_content_model div {
    height: 60px;
    line-height: 60px;
    margin-top: 20px;
    border-radius: 5px;
    color: white;
    font-size: 24px;
  }
</style>
