<template>
  <div class="image-preview-container" @click="isPreviewModalVisible=true">
    <img class="image-preview" :src="FILE_URL_PREFIX+imageUrl" :title="imageName"/>
    <a-modal :visible="isPreviewModalVisible" :footer="null" @cancel="isPreviewModalVisible=false" :mask="showMask">
      <img :alt="imageName" style="width: 100%" :src="FILE_URL_PREFIX+imageUrl"/>
    </a-modal>
  </div>
</template>

<script>
  import {FILE_URL_PREFIX} from "../config/config";

  export default {
    props: {
      imageUrl: {
        type: String,
        required: true
      },
      imageName: {
        type: String,
        default: ''
      },
      showMask:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        FILE_URL_PREFIX,
        isPreviewModalVisible: false
      }
    }
  }
</script>

<style>
  .image-preview-container {
    width: 70px;
    height: 70px;
    border-radius: 4px;
    border: 1px dashed #dddddd;
    margin-right: 16px;
    cursor: pointer;
  }

  .image-preview {
    width: 70px;
    height: 70px;
  }
</style>
