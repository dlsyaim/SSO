<template>
  <a-form :form="form">
    <a-form-item v-bind="formLayout" label="选择区域">
      <a-select placeholder="请选择区域" @blur="getPersonList" mode="multiple">
        <a-select-option v-for="item in regionList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-bind="formLayout" label="选择人员">
      <a-select placeholder="请选择人员" style="cursor: pointer"
                v-decorator="['handlerIds',{rules: [{ required: true, message: '请选择人员!' }]}]">
        <a-spin v-if="isLoadingPersonList" slot="notFoundContent" size="small">正在加载</a-spin>
        <a-select-option v-for="item in personList" :value="item.id" :key="item.id">{{item.name}}</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item v-bind="formLayout" label="委办意见">
      <a-textarea rows="3" v-decorator="['resultDesc']" placeholder="请输入委办意见"></a-textarea>
    </a-form-item>
    <a-form-item :wrapper-col="{span:formLayout.wrapperCol.span,offset:formLayout.labelCol.span}">
      <a-button type="primary" @click="submit" :loading="isSaveLoading">确认</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
  import ARow from "ant-design-vue/es/grid/Row";
  import ACol from "ant-design-vue/es/grid/Col";
  import {get} from "../../../util/axios";
  import {BASE_URL} from "../../../config/config";

  const formLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 6}
  };

  export default {
    components: {ACol, ARow},
    props:{
      regionList:{
        type:Array,
        default(){
          return []
        }
      }
    },
    data() {
      return {
        form:null,
        isSaveLoading:false,
        formLayout,
        personList:[],
        isLoadingPersonList:false
      }
    },
    mounted(){
      this.form=this.$form.createForm(this);
    },
    methods:{
      getPersonList(e){
        if(e.length===0){
          this.isLoadingPersonList=false,
            this.personList=[];
        }else {
          this.isLoadingPersonList=true;
          const roleIds = 'cd2701266a4d4eea90313994548698e2,fca74e7d677111e7968ef01fafcf3a37';// TODO
          get(`${BASE_URL}/eventMgr/v1/event/loadUser?roleIds=${roleIds}&regionIds=${e.join(',')}`).then(res => {
            this.isLoadingPersonList=false;
            if (res.resCode === 1) {
              this.personList = res.data;
            }
          })
        }
      },
      submit(){
        this.form.validateFields((err, value) => {
          if (!err) {
            console.log(value);
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
