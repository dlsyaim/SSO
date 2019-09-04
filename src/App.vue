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
      if(sessionStorage.getItem('Access-Token')){
        const preloader = document.querySelector('.preloader');
        preloader.className += ' preloader-hidden-add preloader-hidden-add-active';
        setTimeout(function () {
          preloader.className += ' preloader-hidden';
        }, 750); // 加载动画变为透明用时750ms，所以750ms后移除该动画
      }
    }
  }
</script>

<style>
  /*ztree设置*/
  .ztree span {
    font-size: 14px;
  }

  .ztree li[treenode] {
    padding: 1px 0;
  }

  /*卡片容器内边距*/
  .card-container {
    padding: 18px;
    height: 100%;
  }

  /*默认的下拉选择器宽度*/
  .card-container .default-select-width {
    width: 200px;
  }

  /*表格内边距*/
  #layout .ant-table-default .ant-table-thead > tr > th, #layout .ant-table-default .ant-table-tbody > tr > td {
    padding: 8px 12px;
  }

  /*表头上边框*/
  th{
    border-top: 1px solid #e8e8e8;
    font-size: 15px;
  }

  /*不显示天地图左下角版权标识*/
  .tdt-control-copyright{
    display: none;
  }

  .table-operation{
    color: #1890ff;
    cursor: pointer;
  }

  /*弹出框每一条详情的内边距*/
  .modal-detail-item{
    font-size: 15px;
    display: flex;
    align-items: flex-start;
    color: rgba(0,0,0,.85);
    margin-bottom: 16px;
  }
  /*弹出框每一条详情的label*/
  .detail-item-label{
    width: 120px;
    display: inline-block;
  }

  .width50{
    width: 50%;
  }
</style>
