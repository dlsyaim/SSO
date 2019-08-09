<template>
  <div class="card-container">
    <a-card title="比重修改" :bordered="false" style="min-height: 100%">
      <a-form :form="form">
        <a-form-item v-bind="formLayout" label="地表水比重">
          <a-input v-decorator="['surfaceWater', {rules: [{ required: true, message: '请输入地表水比重!' },{pattern:'^0\\.[1-9]\\d*$',message:'请输入0到1之间的小数'}],validateFirst:true}]"></a-input>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="各类问题比重">
          <a-input v-decorator="['variousProblem', {rules: [{ required: true, message: '请输入各类问题比重!' },{pattern:'^0\\.[1-9]\\d*$',message:'请输入0到1之间的小数'}],validateFirst:true}]"></a-input>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="河长履职比重">
          <a-input v-decorator="['chairmanDuty', {rules: [{ required: true, message: '请输入河长履职比重!' },{pattern:'^0\\.[1-9]\\d*$',message:'请输入0到1之间的小数'}],validateFirst:true}]"></a-input>
        </a-form-item>
        <a-form-item v-bind="formLayout" label="社会监督比重">
          <a-input v-decorator="['socialSupervise', {rules: [{ required: true, message: '请输入社会监督比重!' },{pattern:'^0\\.[1-9]\\d*$',message:'请输入0到1之间的小数'}],validateFirst:true}]"></a-input>
        </a-form-item>
        <a-form-item v-bind="{ wrapperCol: {span: 4,offset:2}}">
          <a-button type="primary" @click="submit" :loading="isSaveLoading">修改</a-button>
          <a-button @click="reset" style="margin-left: 20px">重置</a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>

  import {get, put} from "../../util/axios";
  import {BASE_URL} from "../../config/config";

  const formLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 4}
  };

  export default {
    data() {
      return {
        id:'6ef547e6697611e9bf70f01fafcf3a37',// TODO
        form:null,
        isSaveLoading:false,
        initValue:null,
        formLayout
      }
    },
    mounted(){
      this.getDetail();
      this.form=this.$form.createForm(this);
    },
    methods:{
      getDetail(){
         const params={
           id:this.id
         };
         get(`${BASE_URL}/assessment/v1/assessScorePercent/detail`,params).then(res=>{
           if(res.resCode===1){
             const data=res.data;
             this.form.setFieldsValue({
               surfaceWater:data.surfaceWater,
               variousProblem:data.variousProblem,
               chairmanDuty:data.chairmanDuty,
               socialSupervise:data.socialSupervise
             });
             this.initValue=data;
           }
         })
      },
      submit(){
        this.form.validateFields((err,value)=>{
          if(!err){
            const params=Object.assign({},value,{id:this.id});
            this.isSaveLoading=true;
            put(`${BASE_URL}/assessment//v1/assessScorePercent/update`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('修改成功');
              }
            })
          }
        })
      },
      reset(){
        const data=this.initValue;
        this.form.setFieldsValue({
          surfaceWater:data.surfaceWater,
          variousProblem:data.variousProblem,
          chairmanDuty:data.chairmanDuty,
          socialSupervise:data.socialSupervise
        });
      }
    }
  }
</script>

<style scoped>

</style>
