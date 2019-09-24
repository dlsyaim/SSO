<template>
  <a-form :form="form">
    <a-form-item v-bind="formLayout" label="退回意见">
      <a-textarea rows="3" v-decorator="['resultDesc']" placeholder="请输入退回意见"></a-textarea>
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
        default:''
      },
      userId:{
        type:String,
        default:''
      }
    },
    data() {
      return {
        form: null,
        formLayout,
        isSaveLoading:false
      }
    },
    mounted() {
      this.form = this.$form.createForm(this);
    },
    methods: {
      submit: function () {
        this.form.validateFields((err, value) => {
          if (!err) {
            this.isSaveLoading = true;
            const params = {
              resultDesc:value.resultDesc,
              eventId:this.eventId,
              userId:this.userId
            };
            get(`${BASE_URL}/eventMgr/v1/event/rollback`,params).then(res=>{
              this.isSaveLoading=false;
              if(res.resCode===1){
                this.$message.success('退回成功');
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
