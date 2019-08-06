<template>
  <div>
    <Header header="西青区河长制平台内部官网"></Header>
    <a-row>
      <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
          breakpoint="lg"
          collapsedWidth="0"
          @collapse="onCollapse"
          @breakpoint="onBreakpoint"
          style="text-align: center;background: white;border: 1px black solid"
        >
          <img style="margin-top: 20px;margin-bottom: 20px" src="../assets/logo.png" width="100"/>
          <h1 id="c_user_name">{{callback_username}}</h1>
          <div id="c_user_info">
            <p>单位：{{callback_company}}</p>
            <p>部门：{{callback_department}}</p>
            <p>工号：{{callback_workno}}</p>
          </div>
          <a-button id="logout">退出</a-button>
        </a-layout-sider>
        <a-layout id="c_content">
          <div style="text-align: center;font-size: 18px;padding-top: 20px;padding-bottom: 20px;background-color: rgba(245, 245, 245, 1);border-bottom: 1px black solid">
            <b>内部应用系统</b>
          </div>
          <a-row  id="c_content_model" style="text-align: center">
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(228, 76, 39, 1)">河长制综合管理系统</a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgba(238, 13, 83, 1)">水系末端调查处理系统</a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(68, 77, 92, 1)">无人机巡河管理系统</a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgba(56, 175, 183, 1)">视频监控异常预警系统</a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(1, 82, 147, 1)">水质监测预警系统</a-col>
            <a-col align="middle" :span="10" :offset="2" style="background: rgba(238, 13, 83, 1)">水务大数据信息管理系统</a-col>
            <a-col align="middle" :span="10" :offset="1" style="background: rgba(51, 153, 102, 1)">外部门户管理后台</a-col>
          </a-row>
        </a-layout>
      </a-layout>
    </a-row>
  </div>
</template>
<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";
  export default {
    data() {
      return {
        collapsed: false,
        callback_username:localStorage.getItem('callback_username'),
        callback_company:localStorage.getItem('callback_company'),
        callback_department:localStorage.getItem('callback_department'),
        callback_workno:localStorage.getItem('callback_workno'),
          }
    },

    created() {

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
      login() {
        const params = {
          userName: this.username,
          password: this.password,
          sessionId: localStorage.getItem('systemtype'),
          captcha: this.captcha
        };
        post(`${BASE_URL}/v1/auth/login`, params).then(res => {
          // sessionStorage.setItem('userDTO', JSON.stringify(res.data.userDTO));
          // const token = res.data.tokenInfo.token.substring(1, res.data.tokenInfo.token.length);
          // sessionStorage.setItem('Access-Token', token);
          if (res.code === 200) {
            localStorage.setItem('ST', res.results.st);
            localStorage.setItem('Token', res.results.token);
            this.callback_username = res.results.user.name;
            this.callback_company = res.results.user.company;
            this.callback_department = res.results.user.dept;
            this.callback_workno = res.results.user.workNo;
            this.showModal();
            setTimeout(() => {
              console.log('延时跳转');
              if (localStorage.getItem('systemtype')) {
                window.location.href = "http://localhost:8080/#/" + localStorage.getItem('systemtype') + "_index";
                console.log("http://localhost:8080/#/" + localStorage.getItem('systemtype') + '_index');
              } else {
                console.log(this.$router);
                window.location.href = "http://localhost:8080/#/Shome";
              }
            }, "3000");
          }
        });
      },
    },
  };
</script>
<style>
  #components-layout-demo-responsive .logo {
    height: 32px;
    margin: 16px;
  }
  #components-layout-demo-responsive {
    width: 80%;
    margin-left: 10%;
    margin-top: 10vh;
    min-height: 60vh;
    background: white;
  }

  #c_content {
    margin-left: 50px;
    border: 1px black solid;
    background: white;
  }
  #c_user_info p{
    border-bottom: 1px black solid;
    padding-bottom: 10px;
    margin-left: 8px;
    margin-right: 8px;
  }
  #c_user_name{
    border-bottom: 1px black solid;
    padding-bottom: 10px;
    margin-left: 8px;
    margin-right: 8px;
  }
  #logout{
    border-width: 0px;
    left: 0px;
    top: 0px;
    width: 140px;
    height: 40px;
    background: inherit;
    background-color: rgba(254, 0, 0, 1);
    border: none;
    border-radius: 5px;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
    color: white;
  }
  #c_content_model div{
    height: 60px;
    line-height: 60px;
    margin-top: 20px;
    border-radius: 5px;
    color: white;
    font-size: 24px;
  }
</style>
