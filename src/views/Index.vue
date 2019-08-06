<template>
  <div>
    a系统
    <button @click="logout">注销用户</button>
  </div>

</template>

<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";

  export default {
    data() {
      return {}
    },

    created() {

      this.indexif();
    },
    beforeCreate() {

    },
    methods: {
      indexif() {
        localStorage.setItem('systemurl', window.location.href);
        localStorage.setItem('systemtype', 'a');
        if (localStorage.getItem('ST')) {
          const params = {
            st: localStorage.getItem('ST')
          };
          post(`${BASE_URL}/v1/auth/validSt`, params).then(res => {
            // sessionStorage.setItem('userDTO', JSON.stringify(res.data.userDTO));
            // const token = res.data.tokenInfo.token.substring(1, res.data.tokenInfo.token.length);
            // sessionStorage.setItem('Access-Token', token);
            if (res.code === 200) {
              console.log(res);
              localStorage.setItem('aToken', res.results.token);
            }
          });
        }
        else {
          this.$router.replace({name: 'Login'})
        }
      },
      logout() {
        localStorage.clear();
        window.location.href="http://localhost:8080/#/";
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
