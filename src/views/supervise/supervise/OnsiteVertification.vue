<template>
  <a-modal :visible="visible"
           @cancel="$emit('change',false)"
           title="现场核查结果"
           width="660px">
    <template slot="footer">
      <a-button key="1" :loading="loading1" @click="handleOk(1)">重新办理</a-button>
      <a-button key="3" :loading="loading3" @click="handleOk(2)">保存</a-button>
      <a-button key="back" @click="$emit('change',false)">取消</a-button>
    </template>
      <p class="modal-detail-item">
        <span class="detail-item-label">审查时间：</span>
        <span>{{checkResult.feedbacktime}}</span>
      </p>
      <p class="modal-detail-item">
        <span class="detail-item-label">审查人：</span>
        <span>{{checkResult.objectname}}</span>
      </p>
      <p class="modal-detail-item">
        <span class="detail-item-label">审查说明：</span>
        <span>{{checkResult.description}}</span>
      </p>
        <div class="modal-detail-item" style="display: flex">
          <span class="detail-item-label">附件：</span>
          <div style="display: inline-block">
            <span  v-for="(item,index) in detailFileList" :key="index"><a :href="FILE_URL_PREFIX+item" target="_blank">{{item.split('_').reverse()[0]}}</a><br/></span>
          </div>
        </div>
      <a-divider/>
    <a-form :form="form">
      <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 16}}" label="上传附件">
        <a-upload @change="uploadFile"
                  name="files"
                  :fileList="fileList"
                  :action="BASE_URL+'/duban/v1/DubanSupervision/upload'"
                  :remove="handleFileRemove">
          <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
            <a-button>
              <a-icon type="upload" />上传文件
            </a-button>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 16}}" label="核查结果">
        <a-select placeholder="请选择核查结果" v-decorator="['result', {rules: [{ required: true, message: '请选择核查结果!' }]}]">
          <a-select-option value="1">未办结</a-select-option>
          <a-select-option value="2">未按期整改</a-select-option>
          <a-select-option value="3">已办结</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {BASE_URL, FILE_URL_PREFIX} from "../../../config/config";
  import {put} from "../../../util/axios";

  export default {
    model: {
      prop: 'visible',
      event: 'change'
    },
    props:{
      visible:{
        type:Boolean,
        default:false
      },
      recordId:String,
      checkResult:{
        type:Object,
        default(){
          return {};
        }
      }
    },
    data() {
      return {
        loading1: false,
        loading2: false,
        loading3: false,
        FILE_URL_PREFIX,
        BASE_URL,
        form:null,
        handleResult:'',
        fileList:[]
      }
    },
    computed:{
      detailFileList(){
        return this.checkResult.assessoryyuan?this.checkResult.assessoryyuan.split(','):[];
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      handleOk(type) {
        this.form.validateFields((err, value) => {
          if (!err) {
            const checkResult=this.checkResult;
            const file=this.fileList.filter(item=>item.responseUrl).map(item=>item.responseUrl);
            const params = {
              id:checkResult.id,
              supervisionid:this.recordId,
              feedbacktime:checkResult.feedbacktime,
              objectname:checkResult.objectname,
              description:checkResult.description,
              status:type,
              assessoryyuan:[...file,...this.checkResult.assessoryyuan.split(',')].join(',')
            };
            this['loading'+type]=true;
            put(`${BASE_URL}/duban/v1/DubanSupervision/updateFeedbackhc`,params).then(res=>{
              this['loading'+type]=false;
              if(res.resCode===1){
                this.$message.success('操作成功');
                this.$emit('success');
                setTimeout(()=>{
                  this.form.resetFields();
                  this.$emit('change',false);
                },1500);
              }
            })
          }
        })
      },
      uploadFile({file, fileList}){
        this.fileList=fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.fileList.forEach(item=>{
            if(item.uid===file.uid){
              item.responseUrl=file.response.data[0];
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handleFileRemove(file){
        this.fileList=this.fileList.filter(item=>item.uid!==file.uid);
      }
    }
  }
</script>

<style scoped>

</style>
