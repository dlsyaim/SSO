<template>
  <a-modal :visible="visible"
           @cancel="$emit('change',false)"
           @ok="handleOk"
           title="发起督办"
           :confirmLoading="isSaveLoading"
           width="760px">
    <a-form :form="form">
      <a-row>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办标题">
            <a-input placeholder="请输入督办标题"
                     v-decorator="['title', {rules: [{ required: true, message: '请输入督办标题!' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="下发日期">
            <a-date-picker style="width: 100%"
                           v-decorator="['issuedtime', {rules: [{ required: true, message: '请选择下发日期!' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="截止日期">
            <a-date-picker style="width: 100%"
                           v-decorator="['deadlinedate', {rules: [{ required: true, message: '请选择截止日期!' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办事项">
            <a-input placeholder="请输入督办事项"
                     v-decorator="['project', {rules: [{ required: true, message: '请输入督办事项!' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办对象">
            <a-select placeholder="请输入督办对象" mode="multiple"
                      v-decorator="['objectid', {rules: [{ required: true, message: '请输入督办对象!' }]}]">
              <a-select-option v-for="item in regionList" :value="item.regionId" :key="item.regionId">
                {{item.regionName}}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办点位">
            <a-input placeholder="请输入督办点位"
                     v-decorator="['address', {rules: [{ required: true, message: '请输入督办点位!' }]}]"/>
          </a-form-item>
        </a-col>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办类型">
            <a-select placeholder="请选择督办类型"
                      v-decorator="['type', {rules: [{ required: true, message: '请选择督办类型!' }]}]">
              <a-select-option v-for="(value,key) in superviseTypeEnum" :value="key" :key="key">{{value}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="12">
          <a-form-item v-bind="formLayout" label="督办原因">
            <a-textarea rows="3" placeholder="请输入督办原因"
                        v-decorator="['reason', {rules: [{ required: true, message: '请输入督办原因!' }]}]"></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col span="24">
          <a-form-item v-bind="{labelCol: {span: 3},wrapperCol: {span: 20}}" label="附件">
            <a-upload @change="uploadFile"
                      name="files"
                      :action="BASE_URL+'/duban/v1/DubanSupervision/upload'"
                      :fileList="fileList"
                      :remove="handleFileRemove">
              <div style="display: flex;align-items: center;justify-content: space-between;width: 144px">
                <a-button>
                  <a-icon type="upload"/>
                  上传附件
                </a-button>
              </div>
            </a-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
  import {BASE_URL} from "../../../config/config";
  import moment from 'moment';
  import {post} from "../../../util/axios";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

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
      regionList:{
        type:Array,
        default(){
          return [];
        }
      },
      superviseTypeEnum:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data() {
      return {
        isFormModalVisible: false,
        isSaveLoading: false,
        form: null,
        formLayout,
        isEdit: false,
        fileList:[],
        BASE_URL,
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      handleOk() {
        this.form.validateFields((err,value)=>{
          if(!err){
            this.isSaveLoading=true;
            const fileUrlArray = this.fileList.filter(item => item.responseUrl).map(item => item.responseUrl);
            value.assessoryyuan=fileUrlArray.join(',');
            value.deadlinedate=moment(value.deadlinedate).format('YYYY-MM-DD');
            value.issuedtime=moment(value.issuedtime).format('YYYY-MM-DD');
            let selectedRegionList=[];
            this.regionList.forEach(item=>{
              value.objectid.forEach(regionId=>{
                if(item.regionId===regionId){
                  selectedRegionList.push(item);
                }
              });
            });
            // 传了regionId还要传regionName?
            value.objectid=value.objectid.join(',');
            value.objectname=selectedRegionList.map(item=>item.regionName);
            this.add(value);
          }
        });
      },
      add(value){
        post(`${BASE_URL}/duban/v1/DubanSupervision/add`,value).then(res=>{
          this.isSaveLoading=false;
          if(res.resCode===1){
            this.$message.success('新增成功');
            this.$emit('success');
            setTimeout(()=>{
              this.form.resetFields();
              this.$emit('change',false);
            },1500);
          }
        })
      },
      uploadFile({file, fileList}) {
        this.fileList = fileList;
        if (file.status === 'done') {
          this.$message.success('上传成功');
          this.fileList.forEach(item => {
            if (item.uid === file.uid) {
              item.responseUrl = file.response.data[0];
            }
          });
        } else if (file.status === 'error') {
          this.$message.error('上传失败');
        }
      },
      handleFileRemove(file) {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid);
      },
    }
  }
</script>

<style scoped>

</style>
