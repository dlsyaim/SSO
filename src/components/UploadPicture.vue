<template>
  <div>
    <a-upload
      :accept="uploadAccept"
      :action="url"
      listType="picture-card"
      :fileList="fileList"
      :remove="handleRemove"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < uploadAmount">
        <a-icon type="plus"/>
        <div class="ant-upload-text">{{uploadText}}</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :mask="showPreviewMask" :footer="null" @cancel="handleCancel">
      <img style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>

<script>
  export default {
    props: {
      url:{
        type:String,
        required:true
      },
      uploadText: {
        type: String,
        default: '上传图片'
      },
      uploadAmount: {
        type: Number,
        default: 1
      },
      uploadAccept: {
        type: String,
        default: 'image/*'
      },
      showPreviewMask:{
        type:Boolean,
        default:false
      },
      initFileList:{
        type:Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        previewVisible: false,
        previewImage: '',
        uploadToken: '',
        fileList:[]
      }
    },
    mounted() {
      this.fileList=this.initFileList;
    },
    methods: {
      handleCancel() {
        this.previewVisible = false
      },
      handlePreview(file) {
        this.previewImage = file.url || file.thumbUrl;
        this.previewVisible = true
      },
      handleChange({file, fileList}) {
        this.fileList = fileList;
        if (file.status === 'done') {
          this.getPictureUrl();
        }
      },
      handleRemove(file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
        this.getPictureUrl();
      },
      getPictureUrl() {
        const keyArray = this.fileList.filter(file => file.response && file.response.key).map(item => item.response.key);
        this.$emit('getPictureUrl', keyArray)
      }
    },
    watch:{
      initFileList:function (newValue) {
        this.fileList=newValue;
      }
    }
  }
</script>

<style scoped>

</style>
