<template>
  <div style="height:100%;background-color: #f5f7fa;">
    <div style="min-height :500px;height:80%;width: 100%;display: flex;justify-content: center;align-items: center;">
      <!-- 404矢量图 -->
      <img src="../../assets/404image.svg" style="height: 430px;width: 360px;margin-right: 100px"/>
      <!-- 说明 -->
      <div style="height: 430px;padding-left: 100px;display: flex;align-items: center">
        <div>
          <h1 style="color: #434e59;font-size: 72px;font-weight: 600;line-height: 72px;margin-bottom: 24px;">404</h1>
          <h3 style="color: rgba(0,0,0,.45);font-size: 20px;line-height: 28px;margin-bottom: 16px;">抱歉，你访问的页面不存在</h3>
          <a-button type="primary" @click="goBack">返回上一页</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      goBack() {
        window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
      }
    }
  }
</script>

<style scoped>

</style>
