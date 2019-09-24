<template>
  <a-form :form="form">
    <a-row>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办标题">
          <a-input v-decorator="['title',{rules: [{ required: true, message: '请输入督办标题!' }]}]" placeholder="请输入督办标题"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="下发日期">
          <a-date-picker v-decorator="['issuedtime',{rules: [{ required: true, message: '请选择下发日期!' }]}]" style="width: 100%" placeholder="请输入督办标题"/>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="截止日期">
          <a-date-picker v-decorator="['deadlinedate',{rules: [{ required: true, message: '请选择截止日期!' }]}]" style="width: 100%" placeholder="请输入督办标题"/>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办事项">
          <a-input v-decorator="['project',{rules: [{ required: true, message: '请输入督办事项!' }]}]" placeholder="请输入督办事项"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办对象">
          <a-select placeholder="请选择督办对象" v-decorator="['objectid',{rules: [{ required: true, message:'请选择督办对象!',type: 'array'}]}]" mode="multiple">
            <a-select-option v-for="item in regionList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办点位">
          <a-input v-decorator="['address',{rules: [{ required: true, message: '请输入督办点位!' }]}]" placeholder="请输入督办点位"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办类型">
          <a-select placeholder="请选择督办类型" v-decorator="['type',{rules: [{ required: true, message:'请选择督办类型!'}]}]">
            <a-select-option value="1">普通督办</a-select-option>
            <a-select-option value="2">现场督办</a-select-option>
            <a-select-option value="3">挂牌督办</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办函标题">
          <a-input v-decorator="['pdfTitle',{rules: [{ required: true, message: '请输入督办函标题!' }]}]" placeholder="请输入督办函标题"></a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办原因">
          <a-textarea rows="3" v-decorator="['reason',{rules: [{ required: true, message: '请输入督办原因!' }]}]" placeholder="请输入督办原因"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="督办函内容">
          <a-textarea rows="3" v-decorator="['pdfContent',{rules: [{ required: true, message: '请输入督办函内容!' }]}]" placeholder="请输入督办函内容"></a-textarea>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col span="8">
        <a-form-item :wrapper-col="{span:formLayout.wrapperCol.span,offset:formLayout.labelCol.span}">
          <a-button type="primary" @click="submit" :loading="isSaveLoading">确认</a-button>
          <a-button @click="reset"  style="margin-left: 20px">重置</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import ATextarea from "ant-design-vue/es/input/TextArea";
  import {post} from "../../../util/axios";
  import {BASE_URL} from "../../../config/config";
  import moment from 'moment';

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 17}
  };
  export default {
    components: {ATextarea, ACol, ARow},
    props:{
      regionList:{
        type:Array,
        default(){
          return []
        }
      },
      eventId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        formLayout,
        form:null,
        isSaveLoading:false
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      submit(){
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading=true;
            const params={
              eventid:this.eventId,
              title:value.title,
              issuedtime:moment(value.issuedtime).format('YYYY-MM-DD'),
              deadlinedate:moment(value.deadlinedate).format('YYYY-MM-DD'),
              project:value.project,
              objectid:value.objectid.join(','),
              address:value.address,
              type:value.type,
              pdfTitle:value.pdfTitle,
              reason:value.reason,
              pdfContent:value.pdfContent
            };
            post(`${BASE_URL}/eventMgr/v1/event/addEventDubandan`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('操作成功');
                setTimeout(()=>{
                  this.$router.go(-1);
                },1500)
              }
            })
          }
        });
      },
      reset(){
        this.form.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
