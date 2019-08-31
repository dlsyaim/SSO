<template>

  <div style="position: relative;z-index: 0">
    <a-spin :spinning="isUploadingPicture">
      <div :id="tagId"></div>
    </a-spin>
    <a-tooltip placement="leftBottom">
      <template slot="title">
        <p>使用帮助</p>
        <p>1.选中图片，点击工具栏中的图片按钮，可以调整图片大小</p>
      </template>
      <a-icon type="question-circle" style="font-size: 20px;position: absolute;top: 10px;right: 10px;cursor: help"/>
    </a-tooltip>
  </div>
</template>
<script>
  import {timer} from 'rxjs'
  import {mapTo} from 'rxjs/operators'
  import {FILE_URL_PREFIX, UPLOAD_URL} from "../config/config";
  import {uploadFile} from "../util/upload";

  const E = require('wangeditor');
  export default {
    props: {
      tagId: {
        type: String,
        required: true
      },
      initialContent: {
        type: String,
        default: ''
      }
    },
    data() {
      return {
        subscription: null,
        isUploadingPicture:false
      }
    },
    mounted() {
      const editor = new E(document.getElementById(this.tagId));
      // 最大同时上传数量为1张，下面上传逻辑写死
      editor.customConfig.uploadImgMaxLength = 1;

      // 大小限时为3m
      editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;

      // 自定义错误提示
      editor.customConfig.customAlert =(info) =>{
        console.log(info);
        if (info.code!==1){
          this.$message.error(info);
        }
      };
      // 自定义上传
      editor.customConfig.customUploadImg = (files, insert) => {
        const data=new FormData();
        data.append('files',files[0]);
        this.isUploadingPicture=true;
        uploadFile(data).then(res=>{
          this.isUploadingPicture=false;
          if(res){
            this.$message.success('图片上传成功');
            insert(FILE_URL_PREFIX+res.data[0]);
          }
        });
      };
      editor.create();
      editor.txt.html(this.initialContent);
      this.subscription = timer(500, 1000).subscribe(() => {
        this.$emit('getEditorContent', editor.txt.html());
      });

    },
    beforeDestroy() {
      this.subscription.unsubscribe();
    }
  };
</script>

<style>
  .w-e-menu {
    font-size: 18px;
  }
</style>
