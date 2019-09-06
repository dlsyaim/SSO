<template>
  <a-form :form="form">
    <a-row>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="履职人员">
          <a-input placeholder="请选择履职人员" readOnly class="cursor-pointer" @click="isModalVisible=true" v-decorator="['chairmanName',{rules:[{required:true,message:'请选择履职人员'}]}]"></a-input>
          <input style="display: none" v-decorator="['chairmanid']"/>
          <member-tree-modal v-model="isModalVisible" @getMember="getMember"></member-tree-modal>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="坑塘面积">
          <a-input placeholder="坑塘面积可由绘制得出" v-decorator="['acreage']"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="坑塘面积">
          <a-input placeholder="坑塘面积可由绘制得出" v-decorator="['acreage']"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="坑塘面积">
          <a-input placeholder="坑塘面积可由绘制得出" v-decorator="['acreage']"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="坑塘面积">
          <a-input placeholder="坑塘面积可由绘制得出" v-decorator="['acreage']"></a-input>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="{wrapperCol: {span: 16,offset:6}}">
          <a-button size="small" type="danger" @click="$emit('deleteForm',formId)">删除</a-button>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import MemberTreeModal from "./MemberTreeModal";

  const formLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 16}
  };

  export default {
    components: {MemberTreeModal, ACol, ARow},
    props:{
      formId:{
        type:Number,
        required:true
      }
    },
    data() {
      return {
        form:null,
        formLayout,
        isModalVisible:false
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      submit(){
        this.form.validateFields((err,value)=>{
          if(!err){
            return value;
          }else {
            return null;
          }
        })
      },
      getMember(e){
        this.form.setFieldsValue({
          chairmanid:e.id,
          chairmanName:e.name
        });
      }
    }
  }
</script>

<style scoped>

</style>
