<template>
  <div>
    <Header header="西青区河长制信息管理平台"></Header>
    <a-row type="flex" justify="space-around" align="middle">
      <a-form style="width: 500px"
              id="components-form-demo-normal-login"
              class="login-form"
      >
        <a-col align="middle" style="margin-top: 70px;margin-bottom: 70px"><img src="../assets/logo.png" width="150"/>
        </a-col>
        <a-form-item>
          <a-input
            v-model="username"
            v-decorator="[
          'userName',
          { rules: [{ required: true, message: 'Please input your username!' }] }
        ]"
            placeholder="用户名"
          >
            <a-icon
              slot="prefix"
              type="user"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model="password"
            v-decorator="[
          'password',
          { rules: [{ required: true, message: 'Please input your Password!' }] }
        ]"
            type="password"
            placeholder="密码"
          >
            <a-icon
              slot="prefix"
              type="lock"
              style="color: rgba(0,0,0,.25)"
            />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-row :gutter="8">
            <a-col :span="18">
              <a-input
                v-model="captcha"
                v-decorator="[
          'captcha',
          { rules: [{ required: true, message: 'Please input your 验证码!' }] }
        ]"
                placeholder="验证码"
              >
                <a-icon
                  slot="prefix"
                  type="lock"
                  style="color: rgba(0,0,0,.25)"
                />
              </a-input>
            </a-col>
            <a-col :span="6" align="middle">
              <a-col style="width: 100%;height: 40px;cursor: pointer" @click="getVcode"
                     :style="imageCodeStyle"></a-col>
            </a-col>
            <a-button style="margin-top: 30px;height: 50px"
                      type="primary"
                      html-type="submit"
                      class="login-form-button"
                      @click="login"
            >
              登录
            </a-button>
          </a-row>
        </a-form-item>
      </a-form>

    </a-row>
    <div>
      <a-modal style="text-align: center"
               title="登录成功"
               :visible="visible"
               :footer="null"
               :confirmLoading="confirmLoading"
      >
        <img src="../assets/logo.png" width="60"/>
        <p>{{callback_username}}</p>
        <p>{{callback_company}}</p>
        <p>{{callback_department}}</p>
        <p>{{callback_workno}}</p>
        <p>自动登录中...</p>
      </a-modal>
    </div>
  </div>

</template>

<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";
  import {getUrlKey} from "../config/config";
  import {BASE_URLimg} from "../config/config";

  export default {
    data() {
      return {
        verificationCodeImageUrl: '',
        imageCodeStyle: {
          background: 'url(' + 'http://39.106.76.142/uip/randImage/imageCode?imageCodeId=' + this.uuid + ') no-repeat'
        },
        username: '',
        password: '',
        captcha: '',
        imageCode: '',
        ModalText: 'Content of the modal',
        visible: false,
        confirmLoading: false,
        callback_username: '',
        callback_company: '',
        callback_department: '',
        callback_workno: '',
      }
    },
    created() {
      // this.getImageCode();
      this.getVcode();
      this.indexif();
    },
    beforeCreate() {
      // this.form = this.$form.createForm(this);
    },
    methods: {
      showModal() {
        this.visible = true
      },
      handleOk(e) {
        this.ModalText = 'The modal will be closed after two seconds';
        this.confirmLoading = true;
        setTimeout(() => {
          this.visible = false;
          this.confirmLoading = false;
        }, 2000);
      },
      handleCancel(e) {
        console.log('Clicked cancel button');
        this.visible = false
      },
      indexif(){
        if (localStorage.getItem('Token')) {
          post(`${BASE_URL}/v1/auth/getSt`, null, null).then(res => {
            if (res.code === 200) {
              localStorage.setItem('ST', res.results.st);
              const bburl = getUrlKey('from');
              console.log('延时跳转');
              if (getUrlKey('info') === 'v2') {
                window.location.href = "http://61.240.12.212:9084?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              }
              else if (getUrlKey('info') === 'v3') {
                window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9080/hzz/?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v4') {
                window.location.href = "http://61.240.12.212:9087?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9087?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v5') {
                window.location.href = "http://61.240.12.212:9086?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9086?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v6') {
                window.location.href = "http://61.240.12.212:9092?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v7') {
                window.location.href = "http://61.240.12.212:9088?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v8') {
                window.location.href = "http://61.240.12.212:9089?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else {
                window.location.href = "http://61.240.12.212:9081/Shome?ST" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9081/Shome?ST" + localStorage.getItem('ST');
              }
            }
          });
        } else {
        }
      },
      login() {
        console.log(getUrlKey('info'));
        const params = new URLSearchParams();
        params.append('userName', this.username);
        params.append('password', this.password);
        params.append('captcha', this.captcha);
        post(`${BASE_URL}/v1/auth/login`, null, params).then(res => {
          if (res.code === 200) {
            localStorage.setItem('ST', res.results.st);
            localStorage.setItem('Token', res.results.token);
            this.callback_username = res.results.user.name;
            this.callback_company = res.results.user.company;
            this.callback_department = res.results.user.dept;
            this.callback_workno = res.results.user.workNo;
            localStorage.setItem('callback_username', res.results.user.name);
            localStorage.setItem('callback_company', res.results.user.company);
            localStorage.setItem('callback_department', res.results.user.dept);
            localStorage.setItem('callback_workno', res.results.user.workNo);
            const bburl = getUrlKey('from');
            this.showModal();
            setTimeout(() => {
              console.log('延时跳转');
              if (getUrlKey('info') === 'v2') {
                window.location.href = "http://61.240.12.212:9084?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              }
              else if (getUrlKey('info') === 'v3') {
                window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9080/hzz/?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v4') {
                window.location.href = "http://61.240.12.212:9087?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9087?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v5') {
                window.location.href = "http://61.240.12.212:9086?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9086?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v6') {
                window.location.href = "http://61.240.12.212:9092?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v7') {
                window.location.href = "http://61.240.12.212:9085?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else if (getUrlKey('info') === 'v8') {
                window.location.href = "http://61.240.12.212:9089?ST=" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9082?ST=" + localStorage.getItem('ST');
              } else {
                window.location.href = "http://61.240.12.212:9081/Shome?ST" + localStorage.getItem('ST');
                // window.location.href = "http://61.240.12.212:9081/Shome?ST" + localStorage.getItem('ST');
              }
            },2000);
          }
        });
      },
      getVcode() {
        get(`${BASE_URL}/v1/auth/captcha`).then(res => {
          this.imageCodeStyle = {
            background: 'url(' + res.results.captcha.image_base64 + ') no-repeat   '
          }
        });
      }
    },
  };
</script>

<style>
  #components-form-demo-normal-login .login-form {
    max-width: 300px;
  }

  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }

  #components-form-demo-normal-login .login-form-button {
    width: 100%;
  }
</style>
