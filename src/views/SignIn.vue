<template>
  <div>
    <Header header="西青区河长制平台单点登录服务"></Header>
    <a-row type="flex" justify="space-around" align="middle">
      <a-form style="width: 500px"
              id="components-form-demo-normal-login"
              :form="form"
              class="login-form"
              @submit="handleSubmit"
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
  import {GetQueryString} from "../config/config";

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
    },
    beforeCreate() {
      this.form = this.$form.createForm(this);
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
      handleSubmit(e) {
        e.preventDefault();
        this.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
          }
        });
      },
      getUUID() {
        const len = 32;//32长度
        let radix = 16;//16进制
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        let uuid = [], i;
        radix = radix || chars.length;
        if (len) {
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          let r;
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }
        return uuid.join('');
      },
      getImageCode() {
        const uuid = this.getUUID();
        this.uuid = uuid;
        this.imageCodeStyle = {
          background: 'url(' + 'http://39.106.76.142/uip/randImage/imageCode?imageCodeId=' + uuid + '&date=' + new Date().getSeconds() + ') no-repeat'
        }
      },
      refreshImageCode() {
        this.getImageCode();
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
            localStorage.setItem('callback_username', res.results.user.name);
            localStorage.setItem('callback_company', res.results.user.company);
            localStorage.setItem('callback_department', res.results.user.dept);
            localStorage.setItem('callback_workno', res.results.user.workNo);
            this.showModal();
            setTimeout( ()=> {
              console.log('延时跳转');
              if (localStorage.getItem('systemtype')) {
                window.location.href="http://localhost:8080/#/"+localStorage.getItem('systemtype')+"_index";
                console.log("http://localhost:8080/#/" + localStorage.getItem('systemtype') + '_index');
              }
              else {
                console.log(this.$router);
                window.location.href="http://localhost:8080/#/Shome";
              }
            }, "3000");
          }
        });
      },
      getVcode() {
        get(`${BASE_URL}/v1/auth/captcha`).then(res => {
          this.imageCodeStyle = {
            background: 'url(' + res.results.captcha.image_base64 + ') no-repeat   '
          }
        })
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
