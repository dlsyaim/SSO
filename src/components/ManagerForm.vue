<template>
  <a-form :form="form">
    <a-row>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="履职人员">
          <a-input placeholder="请选择履职人员" readOnly class="cursor-pointer" @click="isModalVisible=true" v-decorator="['chairmanName',{rules:[{required:true,message:'请选择履职人员'}],initialValue:initialValue.chairmanName}]"></a-input>
          <input style="display: none" v-decorator="['chairmanid',{initialValue:initialValue.chairmanid}]"/>
          <member-tree-modal v-model="isModalVisible" @getMember="getMember"></member-tree-modal>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="履职级别">
          <a-select placeholder="请选择履职级别" v-decorator="['chairmanlevel',{rules:[{required:true,message:'请选择履职级别'}],initialValue:initialValue.chairmanlevel?initialValue.chairmanlevel.toString():undefined}]">
            <a-select-option v-for="item in dutyGradeList" :key="item.id" :value="item.typeValue">{{item.typeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="履职类型">
          <a-select placeholder="请选择履职类型" v-decorator="['chairmanRole',{rules:[{required:true,message:'请选择履职类型'}],initialValue:initialValue.chairmanRole}]">
            <a-select-option v-for="item in dutyTypeList" :key="item.id" :value="item.typeValue">{{item.typeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="管理岸面">
          <a-select placeholder="请选择管理岸面" v-decorator="['administrationCoast',{rules:[{required:true,message:'请选择管理岸面'}],initialValue:initialValue.administrationCoast}]">
            <a-select-option v-for="item in shoreList" :key="item.id" :value="item.typeValue">{{item.typeName}}</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col span="8">
        <a-form-item v-bind="formLayout" label="参与考核">
          <a-radio-group v-decorator="['isAssess',{initialValue:initialValue.isAssess?initialValue.isAssess:'N'}]">
            <a-radio value="Y">是</a-radio>
            <a-radio value="N">否</a-radio>
          </a-radio-group>
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
  import {BASE_URL} from "../config/config";
  import {get} from "../util/axios";

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
      },
      initialValue:{
        type:Object,
        default(){
          return {}
        }
      }
    },
    data() {
      return {
        form:null,
        formLayout,
        dutyGradeList:[],
        dutyTypeList:[],
        shoreList:[],
        isModalVisible:false
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
      this.getDutyGradeList();
      this.getDutyTypeList();
      this.getShoreList();
    },
    methods:{
      getDutyTypeList(){
         get(`${BASE_URL}/watersource/v1/reach/chairmanType`).then(res=>{
           if(res.resCode===1){
             this.dutyTypeList=res.data;
           }
         })
      },
      getDutyGradeList(){
        get(`${BASE_URL}/watersource/v1/river/riverType?type=116`).then(res=>{
          if(res.resCode===1){
            this.dutyGradeList=res.data;
          }
        })
      },
      getShoreList(){
        get(`${BASE_URL}/watersource/v1/river/riverType?type=112`).then(res=>{
          if(res.resCode===1){
            this.shoreList=res.data;
          }
        })
      },
      submit(){
        let chairman=null;
        this.form.validateFields((err,value)=>{
          if(!err){
            chairman =value
          }
        });
        return chairman;
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
