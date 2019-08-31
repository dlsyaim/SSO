<template>
  <div class="card-container">
    <a-card title="微信管理后台" :bordered="false" style="min-height: 100%">
      <a-button size="large" type="primary" @click="goWeChatBackend">微信管理后台</a-button>
    </a-card>
  </div>
</template>

<script>
  export default {
    methods:{
      goWeChatBackend(){
        window.open('http://tjhzz.sunkingoa.com/login.html');
      }
    }
  }
</script>

<style scoped>

</style>
