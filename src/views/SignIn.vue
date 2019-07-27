<template>
  <div class="card-container">
    <a-card :bordered="false" style="height: 100%">
      <div style="display: flex;align-items: center">
        <span>用户名：</span>
        <a-input style="width: 240px;margin-right: 40px" v-model="username" ></a-input>
        <span>密码：</span>
        <a-input style="width: 240px;margin-right: 40px" type="password" v-model="password"></a-input>
        <span>验证码：</span>
        <a-input style="width: 240px;margin-right: 40px" v-model="imageCode"></a-input>
        <div style="width: 60px;height: 30px;margin-right: 40px;cursor: pointer" @click="refreshImageCode"
             :style="imageCodeStyle"></div>
        <a-button @click="login" type="primary">登录</a-button>
      </div>
    </a-card>
  </div>
</template>

<script>
  import {post} from "../util/axios";

  export default {
    data() {
      return {
        verificationCodeImageUrl: '',
        imageCodeStyle:{
          background:'url('+'http://39.106.76.142/uip/randImage/imageCode?imageCodeId='+this.uuid + ') no-repeat'
        },
        username: 'hxqhzb1',
        password: 123456,
        imageCode: '',
        uuid: '',
      }
    },
    created() {
      this.getImageCode();
    },
    methods: {
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
        this.imageCodeStyle={
          background:'url('+'http://39.106.76.142/uip/randImage/imageCode?imageCodeId='+uuid+'&date=' + new Date().getSeconds() + ') no-repeat'
        }
      },
      refreshImageCode() {
        this.getImageCode();
      },
      login() {
        const params = {
          loginName: this.username,
          password: this.password,
          imageCode: this.imageCode,
          imageCodeId: this.uuid
        };
        post('http://39.106.76.142/uip/login/login',params).then(res=>{
          sessionStorage.setItem('userDTO',JSON.stringify(res.data.userDTO));
          const token=res.data.tokenInfo.token.substring(1,res.data.tokenInfo.token.length);
          sessionStorage.setItem('Access-Token',token);
          this.$router.push('/event/wait-deal');
        });
      }
    },

  }
</script>

