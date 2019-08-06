<template>
  <div>
    a系统


  </div>

</template>

<script>
  import {get, post} from "../util/axios";
  import {BASE_URL} from "../config/config";

  export default {
    data() {

    },

    created() {

      this.indexif();
    },
    beforeCreate() {

    },
    methods: {
      indexif(){
        console.log(11);
        localStorage.setItem('system',window.location.href);
        if(localStorage.getItem('token')){
          console.log(11);
        }
        else {
          this.$router.push({name:'/'})
        }
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
