<template>
  <a-modal :visible="visible"
           @cancel="$emit('change',false)"
           @ok="handleOk"
           title="生成督办单"
           :confirmLoading="isSaveLoading"
           >
    <a-form :form="form">

    <a-form-item v-bind="{labelCol: {span: 6},wrapperCol: {span: 16}}" label="督办单内容">
    <a-textarea placeholder="请输入督办单内容" rows="3"
                v-decorator="['pdfContent', {rules: [{ required: true, message: '请输入督办单内容!' }]}]"></a-textarea>
    </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
  import {post} from "../../../util/axios";
  import {BASE_URL} from "../../../config/config";

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
      record:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data() {
      return {
        form:null,
        isSaveLoading:false
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      handleOk(){
        this.form.validateFields((err,value)=>{
          if(!err){
            this.isSaveLoading=true;
            const data={
              address:this.record.address,
              deadlinedate:this.record.deadlinedate,
              id:this.record.id,
              issuedtime:this.record.issuedtime,
              objectid:this.record.objectid,
              objectname:this.record.objectname,
              pdfContent:value.pdfContent,
              pdfTitle:this.record.pdfTitle,
              project:this.record.project,
              reason:this.record.reason,
              title:this.record.title,
              type:this.record.type
            };
            post(`${BASE_URL}/eventMgr/v1/event/addEventDubandan`,data).then(res=>{
              this.isSaveLoading=false;
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
      }
    }
  }
</script>

<style scoped>

</style>
