<template>
  <a-form :form="form">
    <a-form-item v-bind="formLayout" label="选择人员">
      <a-select placeholder="请选择人员" style="cursor: pointer"
                v-decorator="['handlerIds',{rules: [{ required: true, message: '请选择人员!' }]}]">
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
  import {BASE_URL, REGION_ID} from "../../../config/config";
  import ATextarea from "ant-design-vue/es/input/TextArea";

  const formLayout = {
    labelCol: {span: 2},
    wrapperCol: {span: 6}
  };
  export default {
    components: {ATextarea, ACol, ARow},
    props:{
      eventId:{
        type:String,
        required:''
      },
      userId:{
        type:String,
        required:''
      }
    },
    data() {
      return {
        form: null,
        formLayout,
        personList: [],
        isSaveLoading:false
      }
    },
    mounted() {
      this.getPersonList();
      this.form = this.$form.createForm(this);
    },
    methods: {
      getPersonList() {
        const roleIds = 'cb0a5c20b4b811e88338fa163e29a9e1';// TODO
        get(`${BASE_URL}/eventMgr/v1/event/loadUser?roleIds=${roleIds}&regionIds=${REGION_ID}`).then(res => {
          if (res.resCode === 1) {
            this.personList = res.data;
          }
        })
      },
      submit: function () {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const params = {
              handlerIds:value.handlerIds,
              resultDesc:value.resultDesc,
              eventId:this.eventId,
              userId:this.userId
            };
            get(`${BASE_URL}/eventMgr/v1/event/delegate`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('委办成功');
                setTimeout(()=>{
                  this.$router.go(-1);
                },1500)
              }
            })
          }
        });
      },
    }
  }
</script>

<style scoped>

</style>
