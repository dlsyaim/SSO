<template>
  <div class="SignIn_div">
    <a-row type="flex" justify="space-around" align="middle">
      <a-form style="width: 500px"
              id="components-form-demo-normal-login"
              class="login-form"
      >
        <a-col align="middle" style="margin-bottom: 10px;text-align: center">
          <img src="../assets/logo.png" width="70"/>
        </a-col>
        <a-col align="middle" class="SignIn_div_title">
          西青区河(湖)长制信息管理平台
        </a-col>
        <a-form-item style="margin-bottom: 10px">
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
        <a-form-item style="margin-bottom: 10px">
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
        <a-form-item style="margin-bottom: 10px">
          <a-row :gutter="8">
            <a-col :span="14">
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
            <a-col :span="10" align="middle">
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
    import {BASE_URL,BASE_9084,BASE_9086,BASE_9087,BASE_9088,BASE_9085,BASE_9089} from "../config/config";
    import {getUrlKey} from "../config/config";
    import {setCookie,getCookie} from "../util/util";

    export default {
        data() {
            return {
                verificationCodeImageUrl: '',
                imageCodeStyle: {
                    background: 'url(' + 'http://39.106.76.142/uip/randImage/imageCode?imageCodeId=' + this.uuid + ') no-repeat center'
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
            this.getVcode();
            this.indexif();

        },
        beforeCreate() {
            // this.form = this.$form.createForm(this);
            // this.userURL = (function () {//获取用户URL信息（自调用函数）
            //     console.log(window.location.href);
            //     const userURL = window.location.href;
            //     if (userURL.indexOf('61.240.12.212') != -1) {
            //         this.baseUr = '//61.240.12.212';
            //     }else if (userURL.indexOf('192.168.2.109') != -1) {
            //         this.baseUr = '//192.168.2.109';
            //     }
            // })();
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
            indexif() {
                console.log(this.baseUr, '111');
                let expireDays = 1000 * 60 * 60 * 24;
                if (setCookie('Token')) {
                    post(`${BASE_URL}/v1/auth/getSt`, null, null).then(res => {
                        if (res.code === 200) {
                            // localStorage.setItem('ST', res.results.st);
                            setCookie('ST',res.results.st,expireDays);
                            const bburl = getUrlKey('from');
                            console.log('延时跳转');
                            /*
                            v2:外部官网后台管理
                            v3:河长制管理系统
                            v4:无人机巡河系统
                            v5:水系末端
                            v6:水质监测
                            v7:视频监控
                            v8:水系大数据
                            */
                            if (getUrlKey('info') === 'v2') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9084 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9084 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v3') {
                                // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                window.location.href = bburl + "?ST=" + getCookie('ST');
                            } else if (getUrlKey('info') === 'v4') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9087 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9087 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v5') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9088 + "?ST=" + localStorage.getItem('ST');
                                  window.location.href = BASE_9088 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                  window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v6') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9086 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9086 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v7') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9085 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9085 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v8') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9089 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9089 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else {
                                // window.location.href = "/Shome?ST" + localStorage.getItem('ST');
                                window.location.href = "/Shome?ST" + getCookie('ST');
                            }
                        }
                    });
                } else {
                }
            },
            login() {
                let expireDays = 1000 * 60 * 60 * 24 ;
                console.log(getUrlKey('info'));
                const params = new URLSearchParams();
                params.append('userName', this.username);
                params.append('password', this.password);
                params.append('captcha', this.captcha);
                post(`${BASE_URL}/v1/auth/login`, null, params).then(res => {
                    if (res.code === 200) {
                        setCookie('ST', res.results.st,expireDays);
                        setCookie('Token', res.results.token,expireDays);
                        this.callback_username = res.results.user.name;
                        this.callback_company = res.results.user.company;
                        this.callback_department = res.results.user.dept;
                        this.callback_workno = res.results.user.workNo;
                        setCookie('callback_username', escape(res.results.user.name),expireDays);
                        setCookie('callback_company', res.results.user.company,expireDays);
                        setCookie('callback_department', res.results.user.dept,expireDays);
                        setCookie('callback_workno', res.results.user.workNo,expireDays);
                        const bburl = getUrlKey('from');
                        this.showModal();
                        setTimeout(() => {
                            console.log('延时跳转');
                            if (getUrlKey('info') === 'v2') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9084 + "?ST=" + localStorage.getItem('ST');
                                  window.location.href = BASE_9084 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v3') {
                                window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                window.location.href = bburl + "?ST=" + getCookie('ST');
                            } else if (getUrlKey('info') === 'v4') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9087 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9087 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v5') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9088 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9088 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v6') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9086 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9086 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v7') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9085 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9085 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else if (getUrlKey('info') === 'v8') {
                                if (bburl == undefined) {
                                    // window.location.href = BASE_9089 + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = BASE_9089 + "?ST=" + getCookie('ST');
                                } else {
                                    // window.location.href = bburl + "?ST=" + localStorage.getItem('ST');
                                    window.location.href = bburl + "?ST=" + getCookie('ST');
                                }
                            } else {
                                // window.location.href = "/Shome?ST" + localStorage.getItem('ST');
                                window.location.href = "/Shome?ST" + getCookie('ST');
                            }
                        }, 2000);
                    }
                });
            },
            getVcode() {
                get(`${BASE_URL}/v1/auth/captcha`).then(res => {
                    this.imageCodeStyle = {
                        background: 'url(' + res.results.captcha.image_base64 + ') no-repeat  center '
                    }
                });
            }
        },
    };
</script>

<style>
  body {
    background: url("../assets/background.png") no-repeat center fixed;
    background-size: cover;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    height: auto;
  }

  .SignIn_div {
    width: 400px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 150px;
    background: #f7fbfe;
    padding: 20px 40px;
  }
  .SignIn_div_title{
    text-align: center;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: 700;
  }



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
