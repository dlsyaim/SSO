<template>
  <a-locale-provider :locale="locale">
    <router-view/>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  export default {
    data() {
      return {
        locale: zhCN,
      }
    },
    mounted() {
      const preloader = document.querySelector('.preloader');
      preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
      setTimeout(function () {
        preloader.className += ' preloader-hidden';
      }, 750); // 加载动画变为透明用时750ms，所以750ms后移除该动画
    }
  }
</script>

<style>
  /*ztree设置*/
  .ztree span{
    font-size: 14px;
  }
  .ztree li[treenode]{
    padding: 1px 0;
  }
  /*卡片容器内边距*/
  .card-container{
    padding: 18px;
    height: 100%;
  }
  /*默认的下拉选择器宽度*/
  .default-select-width{
    width: 240px;
  }
</style>
